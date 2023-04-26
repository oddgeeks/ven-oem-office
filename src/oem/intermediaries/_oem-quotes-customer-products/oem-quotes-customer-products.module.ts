import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemQuotesCustomerProducts } from './oem-quotes-customer-products.entity';
import { OemQuotesCustomerProductsService } from './oem-quotes-customer-products.service';
import { OemQuotesCustomerProductsController } from './oem-quotes-customer-products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemQuotesCustomerProducts])],
  providers: [OemQuotesCustomerProductsService],
  exports: [OemQuotesCustomerProductsService],
  controllers: [OemQuotesCustomerProductsController],
})
export class OemQuotesCustomerProductsModule {}
