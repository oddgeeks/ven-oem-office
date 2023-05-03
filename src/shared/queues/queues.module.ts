import { Module, Scope, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import * as config from '../../environments';
import { QueuesService } from './queues.service';
import { QueueConsumers } from './queues.consumers';
import { OemQuoteApprovalQueuesModule } from '../../oem/intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queues.module';
import { OemVendoApprovalQueuesModule } from '../../oem/intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queues.module';
import { OemNotificationPreferencesModule } from '../../oem/main/oem-notification-preferences/oem-notification-preferences.module';
import { OemQuotesModule } from '../../oem/main/oem-quotes/oem-quotes.module';
import { OemVendosModule } from '../../oem/main/oem-vendos/oem-vendos.module';
import { OemActionLogEntity } from '../../oem/main/oem-action-logs/oem-action-log.entity';
import { OemNotificationPreference } from '../../oem/main/oem-notification-preferences/oem-notification-preference.entity';
import { OemNotificationPreferencesService } from '../../oem/main/oem-notification-preferences/oem-notification-preferences.service';
import { OemActionLogsService } from '../../oem/main/oem-action-logs/oem-action-logs.service';
import { QueueNames } from './queues.enums/queue-enum';
import { SalesforceModule } from '../salesforce/salesforce.module';
import { OemQuoteEntity } from '../../oem/main/oem-quotes/oem-quote.entity';
import { OemProductEntity } from '../../oem/main/oem-products/oem-product.entity';
import { OemQuotesContacts } from '../../oem/intermediaries/_oem-quotes-contacts/oem-quotes-contacts.entity';
import { OemCustomersProducts } from '@src/oem/intermediaries/_oem-customers-products/oem-customers-products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [OemActionLogEntity, OemNotificationPreference],
      'MASTER_CONNECTION',
    ),
    TypeOrmModule.forFeature([
      OemQuoteEntity,
      OemProductEntity,
      OemQuotesContacts,
      OemCustomersProducts,
    ]),
    BullModule.forRoot({
      redis: config.redis,
    }),
    // queues
    BullModule.registerQueue({
      name: QueueNames.QuoteApproval,
    }),
    BullModule.registerQueue({
      name: QueueNames.VendoApproval,
    }),
    BullModule.registerQueue({
      name: QueueNames.BatchedEmail,
    }),
    BullModule.registerQueue({
      name: QueueNames.PdfExport,
    }),
    // Batch job to sync salesforce
    BullModule.registerQueue({
      name: QueueNames.SyncSalesForce,
    }),

    // dependencies
    OemQuoteApprovalQueuesModule,
    OemVendoApprovalQueuesModule,
    OemNotificationPreferencesModule,
    forwardRef(() => OemQuotesModule),
    forwardRef(() => OemVendosModule),
    SalesforceModule,
  ],
  providers: [
    QueuesService,
    //we should use super connection
    OemNotificationPreferencesService,
    {
      provide: OemNotificationPreferencesService,
      useClass: OemNotificationPreferencesService,
      inject: ['NotificationPreferenceRepository'],
    },
    //we should use super connection
    {
      provide: OemActionLogsService,
      useClass: OemActionLogsService,
      inject: ['OemActionLogEntityRepository'],
    },
    ...QueueConsumers,
    {
      provide: 'NotificationPreferenceRepository',
      useFactory: (connection: Connection) =>
        connection.getRepository(OemNotificationPreference),
      inject: [getDataSourceToken('MASTER_CONNECTION')],
      scope: Scope.TRANSIENT,
    },
    {
      provide: 'OemActionLogEntityRepository',
      useFactory: (connection: Connection) =>
        connection.getRepository(OemActionLogEntity),
      inject: [getDataSourceToken('MASTER_CONNECTION')],
      scope: Scope.TRANSIENT,
    },
  ],
  exports: [QueuesService],
  controllers: [],
})
export class QueuesModule {}
