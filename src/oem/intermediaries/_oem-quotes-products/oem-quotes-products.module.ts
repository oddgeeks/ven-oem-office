import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemQuotesProducts } from './oem-quotes-products.entity';
import { OemQuotesProductsService } from './oem-quotes-products.service';
import { OemQuotesProductsController } from './oem-quotes-products.controller';
import { OemProductsModule } from '../../main/oem-products/oem-products.module';
import { OemActionLogEntity } from '../../main/oem-action-logs/oem-action-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemQuotesProducts, OemActionLogEntity]),
    OemProductsModule,
  ],
  providers: [OemQuotesProductsService],
  exports: [OemQuotesProductsService],
  controllers: [OemQuotesProductsController],
})
export class OemQuotesProductsModule {}
