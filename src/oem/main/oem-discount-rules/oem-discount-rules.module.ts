import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemDiscountRuleEntity } from './oem-discount-rule.entity';
import { OemDiscountRulesService } from './oem-discount-rules.service';
import { OemDiscountRulesController } from './oem-discount-rules.controller';
import { OemActionLogEntity } from '../oem-action-logs/oem-action-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemDiscountRuleEntity, OemActionLogEntity]),
  ],
  providers: [OemDiscountRulesService],
  exports: [OemDiscountRulesService],
  controllers: [OemDiscountRulesController],
})
export class OemDiscountRulesModule {}
