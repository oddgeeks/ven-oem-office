import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemQuotesUsers } from './oem-quotes-users.entity';
import { OemQuotesUsersService } from './oem-quotes-users.service';
import { OemQuotesUsersController } from './oem-quotes-users.controller';
import { OemQuoteApprovalQueuesModule } from '../_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queues.module';
import { OemActionLogEntity } from '../../main/oem-action-logs/oem-action-log.entity';
import { OemHierarchyEntity } from '../../main/oem-hierarchies/oem-hierarchy.entity';
import { ACLModule } from '../../../auth/roles/acl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OemQuotesUsers,
      OemActionLogEntity,
      OemHierarchyEntity,
    ]),
    OemQuoteApprovalQueuesModule,
    ACLModule,
  ],
  providers: [OemQuotesUsersService],
  exports: [OemQuotesUsersService],
  controllers: [OemQuotesUsersController],
})
export class OemQuotesUsersModule {}
