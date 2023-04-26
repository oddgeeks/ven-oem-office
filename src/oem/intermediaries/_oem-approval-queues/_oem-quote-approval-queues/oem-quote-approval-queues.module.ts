import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { APP_SECRET } from '../../../../environments';
import { OemQuoteApprovalQueue } from './oem-quote-approval-queue.entity';
import { OemQuoteApprovalQueuesService } from './oem-quote-approval-queues.service';
import { OemQuoteApprovalQueuesController } from './oem-quote-approval-queues.controller';
import { OemNotificationsModule } from '../../../main/oem-notifications/oem-notifications.module';
import { OemActionLogEntity } from '../../../main/oem-action-logs/oem-action-log.entity';
import { AuthModule } from '../../../../auth/auth.module';
import { OemQuoteApprovalQueuesControllerExternal } from './oem-quote-approval-queues-external.controller';
import { ACLModule } from '../../../../auth/roles/acl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemQuoteApprovalQueue, OemActionLogEntity]),
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
  providers: [Logger, OemQuoteApprovalQueuesService],
  exports: [OemQuoteApprovalQueuesService],
  controllers: [
    OemQuoteApprovalQueuesController,
    OemQuoteApprovalQueuesControllerExternal,
  ],
})
export class OemQuoteApprovalQueuesModule {}
