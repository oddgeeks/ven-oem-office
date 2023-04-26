import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemCustomerAddresses } from './oem-customer-addresses.entity';
import { OemCustomerAddressesService } from './oem-customer-addresses.service';
import { OemCustomerAddressesController } from './oem-customer-addresses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemCustomerAddresses])],
  providers: [OemCustomerAddressesService],
  exports: [OemCustomerAddressesService],
  controllers: [OemCustomerAddressesController],
})
export class OemCustomerAddressesModule {}
