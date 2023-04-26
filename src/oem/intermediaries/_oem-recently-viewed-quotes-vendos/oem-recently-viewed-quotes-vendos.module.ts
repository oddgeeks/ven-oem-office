import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemRecentlyViewedQuotesVendos } from './oem-recently-viewed-quotes-vendos.entity';
import { OemRecentlyViewedQuotesVendosService } from './oem-recently-viewed-quotes-vendos.service';
import { OemRecentlyViewedQuotesVendosController } from './oem-recently-viewed-quotes-vendos.controller';
import { OemHierarchyEntity } from '../../main/oem-hierarchies/oem-hierarchy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OemRecentlyViewedQuotesVendos,
      OemHierarchyEntity,
    ]),
  ],
  providers: [OemRecentlyViewedQuotesVendosService],
  exports: [OemRecentlyViewedQuotesVendosService],
  controllers: [OemRecentlyViewedQuotesVendosController],
})
export class OemRecentlyViewedQuotesVendosModule {}
