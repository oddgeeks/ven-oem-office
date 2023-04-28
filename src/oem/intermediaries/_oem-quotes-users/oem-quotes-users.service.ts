import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Connection, EntityManager, Not, Repository } from 'typeorm';

import { OemQuotesUsers } from './oem-quotes-users.entity';
import { OemQuotesUsersCreateDto } from './oem-quotes-users.dto/oem-quotes-users.create.dto';
import { OemQuotesUsersUpdateDto } from './oem-quotes-users.dto/oem-quotes-users.update.dto';
import { OemQuotesUsersReplaceDto } from './oem-quotes-users.dto/oem-quotes-users.replace.dto';
import { OemQuoteApprovalQueuesService } from '../_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queues.service';
import { OemQuoteApprovalQueue } from '../_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { OemUserEntity } from '../../main/oem-users/oem-user.entity';
import { OemVacationRule } from '../../main/oem-rules/oem-vacation-rules/oem-vacation-rule.entity';
import { OemQuoteEntity } from '../../main/oem-quotes/oem-quote.entity';
import { ActionLogs } from '../../main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../main/oem-action-logs/oem-action-log.enums/actions.enum';
import { QuoteApprovalQueueTargetTypeEnum } from '../_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.enums/quote-approval-queue-target-type.enum';
import { QuoteStatusEnum } from '../../main/oem-quotes/oem-quote.enums/quote-status.enum';
import { OemQuotesUsersDto } from './oem-quotes-users.dto/oem-quotes-users.dto';
import { RoleAbilityFactory } from '../../../auth/roles/role-ability.factory';
import { RoleActions } from '../../../auth/roles/types/role-actions.enum';
import { RoleSubjects } from '../../../auth/roles/types/role-subjects.type';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemQuotesUsersService extends TypeOrmCrudService<OemQuotesUsers> {
  constructor(
    private connection: Connection,
    @InjectRepository(OemQuotesUsers) public repo: Repository<OemQuotesUsers>,
    @Inject(OemQuoteApprovalQueuesService)
    private quoteApprovalQueuesService: OemQuoteApprovalQueuesService,
    private roleAbilityFactory: RoleAbilityFactory,
  ) {
    super(repo);
  }

  async getOne(req: CrudRequest) {
    return super.getOne(req);
  }

  private async _create(
    req: CrudRequest,
    dto: Partial<OemQuotesUsersCreateDto>,
    manager: EntityManager,
  ) {
    // TODO: I think we need to have a separate service to be able control vacation rules + decorator + local interceptor;
    // for quoteId and vendoId better user validator for checking if exists
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

    const quote = await manager.findOne(OemQuoteEntity, dto.quoteId);
    if (!quote) throw new NotFoundException('Quote not found');

    if (quote.quoteStatus === QuoteStatusEnum.EXPIRED)
      throw new BadRequestException('Quote expired');

    const quoteUser = await manager.save(
      this.repo.create({
        ...dto,
        userId,
        companyId: req['user']['companyId'],
      }),
    );

    // disable other approvers if we are setting to current one
    if (dto.isApprover === true)
      await manager.update(
        OemQuotesUsers,
        {
          quoteId: dto.quoteId,
          userId: Not(userId),
          isEnabled: true,
        },
        {
          isApprover: false,
        },
      );

    // updateApprovalQueue only if quote isn't DRAFT
    if (quote.quoteStatus !== QuoteStatusEnum.DRAFT) {
      return this.updateApprovalQueue(req, dto, quoteUser, manager);
    }

    return quoteUser;
  }

  async createOne(
    req: CrudRequest,
    dto: Partial<OemQuotesUsersCreateDto>,
  ): Promise<OemQuotesUsers> {
    return this.connection.transaction(async (manager) =>
      this._create(req, dto, manager),
    );
  }

  async updateApprovalQueue(
    req: any,
    dto: Partial<OemQuotesUsersDto>,
    updatedQuoteUser: OemQuotesUsers,
    manager: EntityManager,
  ) {
    //if we set isApprover to true, then we need update other quoteUsers to be set to isApprover to false
    const quoteId = updatedQuoteUser.quoteId;
    const userId = updatedQuoteUser.userId;

    /* //this one only for customer and external users, that means eApprover
     if (
       quoteUser.isApprover === dto.isApprover ||
       dto.isApprover === undefined
     ) {
       return updatedQuoteUser;
     }*/

    //if we do not change isApprover, then we do not update quoteApprovalQueues

    // deactivate other queues with targetType = 'customer'
    if (dto.isApprover === true) {
      await manager.update(
        OemQuoteApprovalQueue,
        {
          quoteId: quoteId,
          isEnabled: true,
          isActive: true,
          targetType: QuoteApprovalQueueTargetTypeEnum.CUSTOMER,
        },
        {
          isActive: false,
        },
      );
    }

    const user = await manager.findOne(OemUserEntity, userId);
    const ability = await this.roleAbilityFactory.createForUser(user);
    if (ability.cannot(RoleActions.Modify, RoleSubjects.QuoteApprovalQueue)) {
      return updatedQuoteUser;
    }

    const quoteApprovalQueue = await manager.findOne(OemQuoteApprovalQueue, {
      where: {
        quoteId: updatedQuoteUser.quoteId,
        userId: updatedQuoteUser.userId,
      },
    });
    if (!quoteApprovalQueue) {
      await this.quoteApprovalQueuesService.create(
        {
          userId: userId,
          quoteId: quoteId,
          companyId: updatedQuoteUser.companyId,
          targetType:
            updatedQuoteUser.isApprover === true
              ? QuoteApprovalQueueTargetTypeEnum.CUSTOMER
              : QuoteApprovalQueueTargetTypeEnum.EXTERNAL,
        },
        manager,
      );
    } else {
      await manager.update(
        OemQuoteApprovalQueue,
        {
          quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
        },
        {
          isActive: true,
          targetType:
            updatedQuoteUser.isApprover === true
              ? QuoteApprovalQueueTargetTypeEnum.CUSTOMER
              : QuoteApprovalQueueTargetTypeEnum.EXTERNAL,
        },
      );
    }

    return updatedQuoteUser;
  }

  async update(
    req,
    quoteId: number,
    userId: number,
    dto: Partial<OemQuotesUsersUpdateDto>,
    manager: EntityManager,
  ) {
    const quoteUser = await this.repo.findOne({
      where: {
        quoteId,
        userId,
      },
      relations: ['quote'],
    });
    if (!quoteUser) {
      throw new NotFoundException('Quote user not found');
    }

    if (quoteUser.quote.quoteStatus === QuoteStatusEnum.EXPIRED)
      throw new BadRequestException('Quote expired');

    if (quoteUser.isApprover !== false && dto.isApprover === false) {
      throw new BadRequestException(
        'You cannot set isApprover to false, please choose another quote user and set him to isApprover, the current would be disabled',
      );
    }
    //disable other approvers if we are setting to current one
    if (dto.isApprover === true)
      await manager.update(
        OemQuotesUsers,
        {
          quoteId: quoteId,
          userId: Not(userId),
          isEnabled: true,
        },
        {
          isApprover: false,
        },
      );

    const updatedQuoteUser = await manager.save(
      this.repo.create({
        ...quoteUser,
        ...dto,
        companyId: req.user.companyId,
      }),
    );
    //update approval queue only if quote isn't draft
    if (quoteUser.quote.quoteStatus !== QuoteStatusEnum.DRAFT) {
      return this.updateApprovalQueue(req, dto, updatedQuoteUser, manager);
    } else return updatedQuoteUser;
  }

  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.DETACH)
  async deleteOne(req: CrudRequest) {
    return this.connection.transaction(async (manager) => {
      const quoteId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      const userId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.userId.field,
      );

      await manager.update(
        OemQuoteApprovalQueue,
        {
          quoteId: quoteId,
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

  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.ATTACH)
  async updateOne(req: CrudRequest, dto: any): Promise<OemQuotesUsers> {
    return this.connection.transaction(async (manager) => {
      const quoteId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );
      const userId =
        req.parsed.paramsFilter.find(
          (params) => params.field === req.options.params.userId.field,
        ) || dto.userId;

      return this.update(req, quoteId.value, userId.value, dto, manager);
    });
  }

  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.ATTACH)
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemQuotesUsersReplaceDto>,
  ): Promise<OemQuotesUsers> {
    return this.connection.transaction(async (manager) => {
      const quoteId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );
      const userId = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.userId.field,
      );

      const quoteUser = await this.repo.findOne({
        where: {
          quoteId: quoteId.value,
          userId: userId.value,
        },
      });

      if (quoteUser) {
        return this.update(req, quoteId.value, userId.value, dto, manager);
      }

      return this._create(req, dto, manager);
    });
  }
}
