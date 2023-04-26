import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemDiscountRulesDiscounts } from './oem-discount-rules-discounts.entity';
import { OemDiscountEntity } from '../../main/oem-discounts/oem-discount.entity';
import { OemDiscountRulesDiscountsController } from './oem-discount-rules-discounts.controller';
import { OemDiscountRulesDiscountsService } from './oem-discount-rules-discounts.service';
import { IsDiscountProgram } from './oem-discount-rules-discounts.validators/oem-discount-rules-discounts.validators';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemDiscountEntity, OemDiscountRulesDiscounts]),
  ],
  providers: [OemDiscountRulesDiscountsService, IsDiscountProgram],
  exports: [OemDiscountRulesDiscountsService, IsDiscountProgram],
  controllers: [OemDiscountRulesDiscountsController],
})
export class OemDiscountRulesDiscountsModule {}
