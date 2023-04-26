import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemSalesforceService } from './oem-salesforce.service';
import { SalesforceModule } from '../../../shared/salesforce/salesforce.module';
import { OemSalesforceTokenEntity } from './oem-salesforce-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemSalesforceTokenEntity]),
    SalesforceModule,
  ],
  providers: [OemSalesforceService],
  exports: [OemSalesforceService],
  controllers: [],
})
export class OemSalesforceModule {}
