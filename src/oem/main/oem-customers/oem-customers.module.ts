import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemCustomerEntity } from './oem-customer.entity';
import { OemCustomersService } from './oem-customers.service';
import { OemCustomersController } from './oem-customers.controller';
import { OemSalesforceModule } from '../oem-salesforce/oem-salesforce.module';
import { OemSalesforceService } from '../oem-salesforce/oem-salesforce.service';

@Module({
  imports: [TypeOrmModule.forFeature([OemCustomerEntity]), OemSalesforceModule],
  providers: [OemCustomersService],
  exports: [OemCustomersService],
  controllers: [OemCustomersController],
})
export class OemCustomersModule {}
