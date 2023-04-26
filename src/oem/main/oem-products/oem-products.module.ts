import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemProductEntity } from './oem-product.entity';
import { OemProductsService } from './oem-products.service';
import { OemProductsController } from './oem-products.controller';
import { OemHierarchyEntity } from '../oem-hierarchies/oem-hierarchy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OemProductEntity, OemHierarchyEntity])],
  providers: [OemProductsService],
  exports: [OemProductsService],
  controllers: [OemProductsController],
})
export class OemProductsModule {}
