import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemCustomersProducts } from './oem-customers-products.entity';
import { OemCustomersProductsService } from './oem-customers-products.service';
import { OemCustomersProductsController } from './oem-customers-products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemCustomersProducts])],
  providers: [OemCustomersProductsService],
  exports: [OemCustomersProductsService],
  controllers: [OemCustomersProductsController],
})
export class OemCustomersProductsModule {}
