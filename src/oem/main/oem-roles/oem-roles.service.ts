import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository, Connection, EntityManager } from 'typeorm';

import { OemRoleEntity } from './oem-role.entity';
import { OemRoleCreateDto } from './oem-role.dto/oem-role.create.dto';
import { OemRoleUpdateDto } from './oem-role.dto/oem-role.update.dto';
import { OemRoleReplaceDto } from './oem-role.dto/oem-role.replace.dto';
import { OemApprovalQeuePrioritiesService } from '../oem-approval-queue-priorities/oem-approval-queue-priorities.service';
import { OemApprovalQueuePriority } from '../oem-approval-queue-priorities/oem-approval-queue-priority.entity';
import { RoleTypeEnum } from './oem-role.enums/role-type.enum';
import { ActionLogs } from '../oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../oem-action-logs/oem-action-log.enums/actions.enum';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemRolesService extends TypeOrmCrudService<OemRoleEntity> {
  constructor(
    private connection: Connection,
    @InjectRepository(OemRoleEntity) public repo: Repository<OemRoleEntity>,
    @Inject(OemApprovalQeuePrioritiesService)
    private approvalQueuePrioritiesService: OemApprovalQeuePrioritiesService,
  ) {
    super(repo);
  }

  async create(dto: Partial<OemRoleCreateDto>, manager: EntityManager) {
    const role = await manager.save(this.repo.create(dto));

    if (
      dto.roleType === RoleTypeEnum.WORKFLOW_APPROVER ||
      dto.roleType === RoleTypeEnum.CHANNEL_MANAGER
    ) {
      await this.approvalQueuePrioritiesService.create(
        {
          companyId: role.companyId,
          roleId: role.roleId,
        },
        manager,
      );
    }

    return role;
  }

  @ActionLogs(ActionLogTypeEnum.ROLE, ActionsEnum.CREATE)
  async createOne(
    req: CrudRequest,
    dto: Partial<OemRoleCreateDto>,
  ): Promise<OemRoleEntity> {
    return this.connection.transaction(async (manager) =>
      this.create(dto, manager),
    );
  }

  async update(
    roleId: number,
    dto: Partial<OemRoleUpdateDto>,
    manager: EntityManager,
  ) {
    const role = await this.repo.findOne(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (
      (dto.roleType || role.roleType) === RoleTypeEnum.ADMIN &&
      dto.isActive === false
    ) {
      throw new ForbiddenException('Not allowed to deactivate the admin role');
    }

    const updatedRole = await manager.save(
      this.repo.create({
        ...role,
        ...dto,
      }),
    );

    let isEnabledApprovalPriority = false;
    if (
      updatedRole.roleType === RoleTypeEnum.WORKFLOW_APPROVER ||
      updatedRole.roleType === RoleTypeEnum.CHANNEL_MANAGER
    ) {
      isEnabledApprovalPriority = true;
    }
    const approvalQueuePriority = await manager.findOne(
      OemApprovalQueuePriority,
      {
        where: {
          companyId: updatedRole.companyId,
          roleId: updatedRole.roleId,
        },
      },
    );
    //honestly we should not return error NotFoundException to client bc he cannot control it - but we should in logs
    if (!approvalQueuePriority) {
      //throw new NotFoundException('Approval Queue Priority not found');
      await this.approvalQueuePrioritiesService.create(
        {
          companyId: role.companyId,
          roleId: role.roleId,
          isActive: updatedRole.isActive && isEnabledApprovalPriority,
          isEnabled: isEnabledApprovalPriority,
        },
        manager,
      );
      return updatedRole;
    }

    await this.approvalQueuePrioritiesService.update(
      approvalQueuePriority.approvalQueuePriorityId,
      {
        isActive: updatedRole.isActive && isEnabledApprovalPriority,
        isEnabled: isEnabledApprovalPriority,
      },
      manager,
    );

    return updatedRole;
  }

  @ActionLogs(ActionLogTypeEnum.ROLE, ActionsEnum.UPDATE)
  async updateOne(
    req: CrudRequest,
    dto: Partial<OemRoleUpdateDto>,
  ): Promise<OemRoleEntity> {
    return this.connection.transaction(async (manager) => {
      const id = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      return this.update(id.value, dto, manager);
    });
  }

  @ActionLogs(ActionLogTypeEnum.ROLE, ActionsEnum.UPDATE)
  async replaceOne(
    req: CrudRequest,
    dto: Partial<OemRoleReplaceDto>,
  ): Promise<OemRoleEntity> {
    return this.connection.transaction(async (manager) => {
      const id = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );

      const role = await this.repo.findOne(id.value);
      if (role) {
        return this.update(id.value, dto, manager);
      }

      return this.create(dto, manager);
    });
  }

  @ActionLogs(ActionLogTypeEnum.ROLE, ActionsEnum.DELETE)
  async deleteOne(...args: []): Promise<OemRoleEntity> {
    return super.deleteOne.call(this, ...args);
  }

  //TODO: I think we can move it to update method, and honestly we do not need to store priority in approval-queue-priority
  async replacePriority({ id, priority }) {
    const replacePriorityInstance = await this.repo.findOne({
      priority: priority,
    });
    const currentPriorityInstance = await this.repo.findOne({
      roleId: id,
    });
    if (!replacePriorityInstance) {
      throw new NotFoundException('Role with such priority not found');
    }
    if (currentPriorityInstance) {
      await this.repo.update(replacePriorityInstance.roleId, {
        priority: currentPriorityInstance.priority,
      });
    }
    await this.repo.update(id, {
      priority: priority,
    });

    const entity = await this.repo.findOne({ roleId: id });
    if (!entity) {
      throw new NotFoundException('Role not found');
    }
    return entity;
  }
}
