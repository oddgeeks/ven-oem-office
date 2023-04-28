import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemDiscountRuleEntity } from './oem-discount-rule.entity';
import { OemDiscountRulesService } from './oem-discount-rules.service';
import { OemDiscountRulesController } from './oem-discount-rules.controller';
import { OemActionLogEntity } from '../../oem-action-logs/oem-action-log.entity';
import { IsDiscountRuleExists } from './oem-discount-rule.validators/is-discount-rule-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemDiscountRuleEntity, OemActionLogEntity]),
  ],
  providers: [OemDiscountRulesService, IsDiscountRuleExists],
  exports: [OemDiscountRulesService, IsDiscountRuleExists],
  controllers: [OemDiscountRulesController],
})
export class OemDiscountRulesModule {}
