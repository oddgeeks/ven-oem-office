import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemQuotesVendosProductsService } from './oem-quotes-vendos-products.service';
import { OemQuotesAndVendosController } from './oem-quotes-and-vendos.controller';
import { OemQuotesAndVendosService } from './oem-quotes-and-vendos.service';
import { OemQuotesModule } from '../../main/oem-quotes/oem-quotes.module';
import { OemVendosModule } from '../../main/oem-vendos/oem-vendos.module';
import { OemQuotesVendosProductsController } from './oem-quotes-vendos-products.controller';
import { OemProductsModule } from '../../main/oem-products/oem-products.module';
import { OemHierarchyEntity } from '../../main/oem-hierarchies/oem-hierarchy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemHierarchyEntity]),
    OemQuotesModule,
    OemVendosModule,
    OemProductsModule,
  ],
  providers: [OemQuotesAndVendosService, OemQuotesVendosProductsService],
  exports: [OemQuotesAndVendosService, OemQuotesVendosProductsService],
  controllers: [
    OemQuotesAndVendosController,
    OemQuotesVendosProductsController,
  ],
})
export class OemQuotesAndVendosModule {}
