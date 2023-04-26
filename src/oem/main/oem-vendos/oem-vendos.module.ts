import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';

import {
  AWS_BUCKET_REGION,
  AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_SECRET_KEY_ID,
  BUCKET_NAME,
} from '../../../environments';

import { OemVendoEntity } from './oem-vendo.entity';
import { OemVendosService } from './oem-vendos.service';
import { OemVendosController } from './oem-vendos.controller';
import { OemVendoApprovalQueuesModule } from '../../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queues.module';
import { OemRecentlyViewedQuotesVendos } from '../../intermediaries/_oem-recently-viewed-quotes-vendos/oem-recently-viewed-quotes-vendos.entity';
import { StatusUpdateValidator } from './oem-vendo.validators/status-update.validator';
import { OemActionLogEntity } from '../oem-action-logs/oem-action-log.entity';
import { OemHierarchyEntity } from '../oem-hierarchies/oem-hierarchy.entity';
import { OemQuoteAndVendoUuidsModule } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuids.module';
import { OemVendosUsers } from '../../intermediaries/_oem-vendos-users/oem-vendos-users.entity';
import { ACLModule } from '../../../auth/roles/acl.module';
import { PdfExporterModule } from '../../../shared/pdf-exporter/pdf-exporter.module';
import { PdfMergerModule } from '../../../shared/pdf-merger/pdf-merger.module';
import { FilenameService } from '../../../shared/s3-upload/services/filename-generator/filename-generator.service';
import { UploaderService } from '../../../shared/s3-upload/services/uploader/uploader.service';
import { QueuesModule } from '../../../shared/queues/queues.module';
import { OemCompanyEntity } from '../oem-companies/oem-company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OemVendoEntity,
      OemCompanyEntity,
      OemRecentlyViewedQuotesVendos,
      OemActionLogEntity,
      OemHierarchyEntity,
      OemVendosUsers,
    ]),
    OemVendoApprovalQueuesModule,
    OemQuoteAndVendoUuidsModule,
    ACLModule,
    PdfExporterModule,
    PdfMergerModule,
    forwardRef(() => QueuesModule),
  ],
  providers: [
    OemVendosService,
    StatusUpdateValidator,
    FilenameService,
    UploaderService,
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
  ],
  exports: [OemVendosService],
  controllers: [OemVendosController],
})
export class OemVendosModule {}
