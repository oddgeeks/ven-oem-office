import { Logger, Module } from '@nestjs/common';
import { Connection as SalesforceClient } from 'jsforce';

import { SalesforceService } from './salesforce.service';

//TODO: we should not use env directly everything should come from config @saleforce_sync
import {
  SALESFORCE_LOGIN_URI,
  SALESFORCE_CLIENT_ID,
  SALESFORCE_CLIENT_SECRET,
} from '../../environments';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OemProductEntity } from '../../oem/main/oem-products/oem-product.entity';
import { OemSalesforceIntegrationEntity } from '../../oem/main/oem-integrations/oem-salesforce-integrations/oem-salesforce-integration.entity';
import { OemHierarchyEntity } from '../../oem/main/oem-hierarchies/oem-hierarchy.entity';
import { OemQuotesContacts } from '../../oem/intermediaries/_oem-quotes-contacts/oem-quotes-contacts.entity';

// Entities
import { OemQuoteEntity } from '../../oem/main/oem-quotes/oem-quote.entity';
import { OemQuotesProducts } from '../../oem/intermediaries/_oem-quotes-products/oem-quotes-products.entity';

//TODO: salesforce module shouldn't know about vendori structure, it should be responsible only for sending data @saleforce_sync
//TODO: also need to use config service here @saleforce_sync
@Module({
  imports: [
    TypeOrmModule.forFeature([
      OemQuoteEntity,
      OemQuotesProducts,
      OemProductEntity,
      OemSalesforceIntegrationEntity,
      OemHierarchyEntity,
      OemQuotesContacts,
    ]),
  ],
  providers: [
    SalesforceService,
    Logger,
    {
      provide: SalesforceClient,
      useFactory: () =>
        new SalesforceClient({
          oauth2: {
            loginUrl: SALESFORCE_LOGIN_URI,
            clientId: SALESFORCE_CLIENT_ID,
            clientSecret: SALESFORCE_CLIENT_SECRET,
          },
        }),
    },
  ],
  exports: [SalesforceService],
  controllers: [],
})
export class SalesforceModule {}
