import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VendosUsers } from './oem-vendos-users.entity';
import { OemVendosUsersService } from './oem-vendos-users.service';
import { OemVendosUsersController } from './oem-vendos-users.controller';
import { OemVendoApprovalQueuesModule } from '../_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queues.module';
import { OemActionLogEntity } from '../../main/oem-action-logs/oem-action-log.entity';
import { ACLModule } from '../../../auth/roles/acl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VendosUsers, OemActionLogEntity]),
    OemVendoApprovalQueuesModule,
    ACLModule,
  ],
  providers: [OemVendosUsersService],
  exports: [OemVendosUsersService],
  controllers: [OemVendosUsersController],
})
export class OemVendosUsersModule {}
