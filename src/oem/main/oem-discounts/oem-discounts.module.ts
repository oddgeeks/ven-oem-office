import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemDiscountEntity } from './oem-discount.entity';
import { OemDiscountsService } from './oem-discounts.service';
import { OemDiscountsController } from './oem-discounts.controller';
import { IsDiscountHasSameType } from '../../intermediaries/_oem-discount-priorities/oem-discount-priorities.validators/oem-discount-priorities.validators';
import { TenantsService } from '../../../shared/tenants/tenants.service';
import { OemActionLogEntity } from '../oem-action-logs/oem-action-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OemDiscountEntity, OemActionLogEntity])],
  providers: [OemDiscountsService, IsDiscountHasSameType],
  exports: [OemDiscountsService, IsDiscountHasSameType],
  controllers: [OemDiscountsController],
})
export class OemDiscountsModule {}
