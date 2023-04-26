import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemCompanyEntity } from './oem-company.entity';
import { OemCompaniesService } from './oem-companies.service';
import { OemCompaniesController } from './oem-companies.controller';
import { OemActionLogEntity } from '../oem-action-logs/oem-action-log.entity';
import { OemQuoteAndVendoUuidsModule } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuids.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemCompanyEntity, OemActionLogEntity]),
    OemQuoteAndVendoUuidsModule,
  ],
  providers: [OemCompaniesService],
  exports: [OemCompaniesService],
  controllers: [OemCompaniesController],
})
export class OemCompaniesModule {}
