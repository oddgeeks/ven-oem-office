import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemRoleEntity } from './oem-role.entity';
import { OemRolesService } from './oem-roles.service';
import { OemRolesController } from './oem-roles.controller';
import { IsPriorityAlreadyExistConstraint } from './oem-role.validators/is-priority-already-exist.validator';
import { IsRoleNameAlreadyExistConstraint } from './oem-role.validators/is-role-name-already-exist.validator';
import { OemApprovalQeuePrioritiesModule } from '../oem-approval-queue-priorities/oem-approval-queue-priorities.module';
import { OemActionLogEntity } from '../oem-action-logs/oem-action-log.entity';

@Module({
  imports: [
    OemApprovalQeuePrioritiesModule,
    TypeOrmModule.forFeature([OemRoleEntity, OemActionLogEntity]),
  ],
  providers: [
    OemRolesService,
    IsPriorityAlreadyExistConstraint,
    IsRoleNameAlreadyExistConstraint,
  ],
  exports: [OemRolesService],
  controllers: [OemRolesController],
})
export class OemRolesModule {}
