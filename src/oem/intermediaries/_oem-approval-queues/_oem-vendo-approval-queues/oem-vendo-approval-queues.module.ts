import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { APP_SECRET } from '../../../../environments';
import { OemVendoApprovalQueue } from './oem-vendo-approval-queue.entity';
import { OemVendoApprovalQueuesService } from './oem-vendo-approval-queues.service';
import { OemVendoApprovalQueuesController } from './oem-vendo-approval-queues.controller';
import { OemNotificationsModule } from '../../../main/oem-notifications/oem-notifications.module';
import { OemActionLogEntity } from '../../../main/oem-action-logs/oem-action-log.entity';
import { AuthModule } from '../../../../auth/auth.module';
import { OemVendoApprovalQueuesControllerExternal } from './oem-vendo-approval-queues.external.controller';
import { ACLModule } from '../../../../auth/roles/acl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemVendoApprovalQueue, OemActionLogEntity]),
    JwtModule.register({
      secret: APP_SECRET,
      signOptions: {
        expiresIn: '30d',
        algorithm: 'HS384',
      },
      verifyOptions: {
        algorithms: ['HS384'],
      },
    }),
    OemNotificationsModule,
    AuthModule,
    ACLModule,
  ],
  providers: [OemVendoApprovalQueuesService],
  exports: [OemVendoApprovalQueuesService],
  controllers: [
    OemVendoApprovalQueuesController,
    OemVendoApprovalQueuesControllerExternal,
  ],
})
export class OemVendoApprovalQueuesModule {}
