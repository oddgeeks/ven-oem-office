import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository, Connection, EntityManager, Not } from 'typeorm';

import { OemVendosUsers } from './oem-vendos-users.entity';
import { OemVendosUsersCreateDto } from './oem-vendos-users.dto/oem-vendos-users.create.dto';
import { OemVendosUsersUpdateDto } from './oem-vendos-users.dto/oem-vendos-users.update.dto';
import { OemVendosUsersReplaceDto } from './oem-vendos-users.dto/oem-vendos-users.replace.dto';
import { OemVendoApprovalQueuesService } from '../_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queues.service';
import { OemVendoApprovalQueue } from '../_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';
import { OemUserEntity } from '../../main/oem-users/oem-user.entity';
import { OemVacationRule } from '../../main/oem-rules/oem-vacation-rules/oem-vacation-rule.entity';
import { OemVendoEntity } from '../../main/oem-vendos/oem-vendo.entity';
import { ActionLogs } from '../../main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../main/oem-action-logs/oem-action-log.enums/actions.enum';
import { VendoApprovalQueueTargetTypeEnum } from '../_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.enums/vendo-approval-queue-target-type.enum';
import { VendoStatusEnum } from '../../main/oem-vendos/oem-vendo.enums/vendo-status.enum';
import { OemVendosUsersDto } from './oem-vendos-users.dto/oem-vendos-users.dto';
import { RoleAbilityFactory } from '../../../auth/roles/role-ability.factory';
import { RoleActions } from '../../../auth/roles/types/role-actions.enum';
import { RoleSubjects } from '../../../auth/roles/types/role-subjects.type';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemVendosUsersService extends TypeOrmCrudService<OemVendosUsers> {
  constructor(
    private connection: Connection,
    @InjectRepository(OemVendosUsers) public repo: Repository<OemVendosUsers>,
    @Inject(OemVendoApprovalQueuesService)
    private vendoApprovalQueuesService: OemVendoApprovalQueuesService,
    private roleAbilityFactory: RoleAbilityFactory,
  ) {
    super(repo);
  }

  async create(
    req: CrudRequest,
    dto: Partial<OemVendosUsersCreateDto>,
    manager: EntityManager,
  ) {
    //TODO: would be better to have a separate class which can control vacation rule
    const vacationRule = await manager.findOne(OemVacationRule, {
      where: {
        sourceUserId: dto.userId,
        isActive: true,
      },
      relations: ['targetUser'],
    });
    const userId = vacationRule?.targetUserId || dto.userId;
    const user = await manager.findOne(OemUserEntity, userId);
    if (!user) throw new NotFoundException('User not found');

    const vendo = await manager.findOne(OemVendoEntity, dto.vendoId);
    if (!vendo) throw new NotFoundException('Vendo not found');

    if (vendo.vendoStatus === VendoStatusEnum.EXPIRED)
      throw new BadRequestException('Vendo expired');

    const vendoUser = await manager.save(
      this.repo.create({
        ...dto,
        userId,
        companyId: req['user']['companyId'],
      }),
    );

    // disable other approvers if we are creating an approver
    if (dto.isApprover === true) {
      await manager.update(
        OemVendosUsers,
        {
          vendoId: dto.vendoId,
          userId: Not(userId),
          isEnabled: true,
        },
        {
          isApprover: false,
        },
      );
    }

    if (vendo.vendoStatus !== VendoStatusEnum.DRAFT)
      return this.updateApprovalQueue(req, dto, vendoUser, manager);
    return vendoUser;
  }

  async updateApprovalQueue(
    req: any,
    dto: Partial<OemVendosUsersDto>,
    updatedVendoUser: OemVendosUsers,
    manager: EntityManager,
  ) {
    //if we set isApprover to true, then we need update other quoteUsers to be set to isApprover to false
    const vendoId = updatedVendoUser.vendoId;
    const userId = updatedVendoUser.userId;
    if (dto.isApprover === true)
      await manager.update(
        OemVendosUsers,
        {
          vendoId: vendoId,
          userId: Not(userId),
          isEnabled: true,
        },
        {
          isApprover: false,
        },
      );

    //if we do not change isApprover, then we do not update quoteApprovalQueues

    //deactivate other queues with targetType = 'customer'
    if (dto.isApprover === true)
      await manager.update(
        OemVendoApprovalQueue,
        {
          vendoId: vendoId,
          isEnabled: true,
          isActive: true,
          targetType: VendoApprovalQueueTargetTypeEnum.CUSTOMER,
        },
        {
          isActive: false,
        },
      );

    const user = await manager.findOne(OemUserEntity, userId);
    const ability = await this.roleAbilityFactory.createForUser(user);
    if (ability.cannot(RoleActions.Modify, RoleSubjects.VendoApprovalQueue)) {
      return updatedVendoUser;
    }

    const vendoApprovalQueue = await manager.findOne(OemVendoApprovalQueue, {
      where: {
        vendoId: updatedVendoUser.vendoId,
        userId: updatedVendoUser.userId,
      },
    });
    if (!vendoApprovalQueue) {
      await this.vendoApprovalQueuesService.create(
        {
          userId: userId,
          vendoId: vendoId,
          companyId: updatedVendoUser.companyId,
          targetType:
            updatedVendoUser.isApprover === true
              ? VendoApprovalQueueTargetTypeEnum.CUSTOMER
              : VendoApprovalQueueTargetTypeEnum.EXTERNAL,
        },
        manager,
      );
    } else {
      await manager.update(
        OemVendoApprovalQueue,
        {
          vendoApprovalQueueId: vendoApprovalQueue.vendoApprovalQueueId,
        },
        {
          isActive: true,
          targetType:
            updatedVendoUser.isApprover === true
              ? VendoApprovalQueueTargetTypeEnum.CUSTOMER
              : VendoApprovalQueueTargetTypeEnum.EXTERNAL,
        },
      );
    }

    return updatedVendoUser;
  }

  async createOne(
    req: CrudRequest,
    dto: Partial<OemVendosUsersCreateDto>,
  ): Promise<OemVendosUsers> {
    return this.connection.transaction(async (manager) =>
      this.create(req, dto, manager),
    );
  }

  //TODO: honestly we might need override this method (but for reduce time using the old implementation), and just resubmit each time when we attach new user to quote
  async update(
    req,
    vendoId: number,
    userId: number,
    dto: Partial<OemVendosUsersUpdateDto>,
    manager: EntityManager,
  ) {
    const vendoUser = await this.repo.findOne({
      where: {
        vendoId,
        userId,
      },
      relations: ['vendo'],
    });
    if (!vendoUser) {
      throw new NotFoundException('Vendo user not found');
    }

    if (vendoUser.vendo.vendoStatus === VendoStatusEnum.EXPIRED)
      throw new BadRequestException('This vendo is expired');

    if (vendoUser.isApprover !== false && dto.isApprover === false) {
      throw new BadRequestException(
        'You cannot set isApprover to false, please choose another quote user and set him to isApprover, the current would be disabled',
      );
    }
    const updatedVendoUser = await manager.save(
      this.repo.create({
        ...vendoUser,
        ...dto,
        companyId: req.user.companyId,
      }),
    );

    if (vendoUser.vendo.vendoStatus !== VendoStatusEnum.DRAFT)
      return this.updateApprovalQueue(req, dto, updatedVendoUser, manager);

    return updatedVendoUser;
  }
  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.DETACH)
  async deleteOne(req: CrudRequest) {
    return this.connection.transaction(async (manager) => {
      const vendoId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      const userId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.userId.field,
      );

      await manager.update(
        OemVendoApprovalQueue,
        {
          vendoId: vendoId,
          userId: userId,
          isEnabled: true,
          isActive: true,
        },
        {
          isActive: false,
          isEnabled: false,
        },
      );
      return super.deleteOne(req);
    });
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.UPDATE)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemVendosUsersUpdateDto>,
  ): Promise<OemVendosUsers> {
    return this.connection.transaction(async (manager) => {
      const vendoId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );
      const userId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.userId.field,
      );

      return this.update(req, vendoId.value, userId.value, dto, manager);
    });
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.ATTACH)
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemVendosUsersReplaceDto>,
  ): Promise<OemVendosUsers> {
    return this.connection.transaction(async (manager) => {
      const vendoId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );
      const userId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.userId.field,
      );

      const vendoUser = await this.repo.findOne({
        where: {
          vendoId: vendoId.value,
          userId: userId.value,
        },
      });

      if (vendoUser) {
        return this.update(req, vendoId.value, userId.value, dto, manager);
      }

      return this.create(req, dto, manager);
    });
  }
}
