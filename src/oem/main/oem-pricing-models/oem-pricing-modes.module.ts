import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemPricingModelEntity } from './oem-pricing-model.entity';
import { OemPricingModelsService } from './oem-pricing-modes.service';
import { OemPricingModelsController } from './oem-pricing-models.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemPricingModelEntity])],
  providers: [OemPricingModelsService],
  exports: [OemPricingModelsService],
  controllers: [OemPricingModelsController],
})
export class OemPricingModelsModule {}
