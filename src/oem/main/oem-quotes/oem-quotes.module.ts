import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemQuoteEntity } from './oem-quote.entity';
import { OemQuotesService } from './oem-quotes.service';
import { OemQuotesController } from './oem-quotes.controller';
import { PdfMergerService } from '../../../shared/pdf-merger/pdf-merger.service';
import { PdfMergerModule } from '../../../shared/pdf-merger/pdf-merger.module';
import { UploaderService } from '../../../shared/s3-upload/services/uploader/uploader.service';
import { UploadModule } from '../../../shared/s3-upload/upload.module';
import { S3 } from 'aws-sdk';
import {
  AWS_BUCKET_REGION,
  AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_SECRET_KEY_ID,
  BUCKET_NAME,
} from '../../../environments';
import { FilenameService } from '../../../shared/s3-upload/services/filename-generator/filename-generator.service';
import { OemHierarchiesService } from '../oem-hierarchies/oem-hierarchies.service';
import { OemHierarchiesModule } from '../oem-hierarchies/oem-hierarchies.module';
import { OemHierarchyEntity } from '../oem-hierarchies/oem-hierarchy.entity';
import { IsGeoHierarchy } from '../oem-hierarchies/oem-hierarchy.validators/oem-hierarchy.validators';
import { OemQuoteApprovalQueuesModule } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queues.module';
import { OemRecentlyViewedQuotesVendos } from '../../intermediaries/_oem-recently-viewed-quotes-vendos/oem-recently-viewed-quotes-vendos.entity';
import { StatusUpdateValidator } from './oem-quote.validators/status-update.validator';
import { OemActionLogEntity } from '../oem-action-logs/oem-action-log.entity';
import { OemQuoteAndVendoUuidsModule } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuids.module';
import { TenantsModule } from '../../../shared/tenants/tenants.module';
import { OemCompanyEntity } from '../oem-companies/oem-company.entity';
import { PdfExporterModule } from '../../../shared/pdf-exporter/pdf-exporter.module';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { OemQuotesUsers } from '../../intermediaries/_oem-quotes-users/oem-quotes-users.entity';
import { ACLModule } from '../../../auth/roles/acl.module';
import { QueuesModule } from '../../../shared/queues/queues.module';

// ----------------------------------------------------------------
// Salesforce changes
// ----------------------------------------------------------------

import { OemCustomersModule } from '../oem-customers/oem-customers.module';
import { OemCustomersService } from '../oem-customers/oem-customers.service';
import { OemCustomerEntity } from '../oem-customers/oem-customer.entity';
import { OemSalesforceService } from '../oem-salesforce/oem-salesforce.service';
import { OemSalesforceTokenEntity } from '../oem-salesforce/oem-salesforce-token.entity';
import { SalesforceModule } from '../../../shared/salesforce/salesforce.module';
import { OemQuotesProducts } from '../../../oem/intermediaries/_oem-quotes-products/oem-quotes-products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OemQuoteEntity,
      OemHierarchyEntity,
      OemRecentlyViewedQuotesVendos,
      OemActionLogEntity,
      OemUserEntity,
      OemQuotesUsers,
      OemCustomerEntity,
      OemSalesforceTokenEntity,
      OemQuotesProducts,
    ]),
    PdfMergerModule,
    PdfExporterModule,
    UploadModule,
    OemCustomersModule,
    SalesforceModule,
    OemHierarchiesModule,
    OemQuoteApprovalQueuesModule,
    OemQuoteAndVendoUuidsModule,
    TenantsModule,
    ACLModule,
    forwardRef(() => QueuesModule),
  ],
  providers: [
    OemHierarchiesService,
    OemQuotesService,
    {
      provide: 'BUCKET_NAME',
      useValue: BUCKET_NAME + '/pdf',
    },
    {
      provide: S3,
      useFactory: () =>
        new S3({
          region: AWS_BUCKET_REGION,
          signatureVersion: 'v2',
          credentials: {
            accessKeyId: AWS_S3_SECRET_KEY_ID,
            secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
          },
        }),
    },
    PdfMergerService,
    UploaderService,
    OemCustomersService,
    OemSalesforceService,
    FilenameService,
    IsGeoHierarchy,
    StatusUpdateValidator,
  ],
  exports: [OemQuotesService],
  controllers: [OemQuotesController],
})
export class OemQuotesModule {}
