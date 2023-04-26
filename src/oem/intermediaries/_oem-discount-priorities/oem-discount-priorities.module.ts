import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemDiscountEntity } from '../../main/oem-discounts/oem-discount.entity';

import { OemDiscountPrioritiesService } from './oem-discount-priorities.service';
import { OemDiscountPriorities } from './oem-discount-priorities.entity';
import { OemDiscountPrioritiesController } from './oem-discount-priorities.controller';
import { IsDiscountHasSameType } from './oem-discount-priorities.validators/oem-discount-priorities.validators';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemDiscountEntity, OemDiscountPriorities]),
  ],
  providers: [OemDiscountPrioritiesService, IsDiscountHasSameType],
  exports: [OemDiscountPrioritiesService, IsDiscountHasSameType],
  controllers: [OemDiscountPrioritiesController],
})
export class OemDiscountPrioritiesModule {}
