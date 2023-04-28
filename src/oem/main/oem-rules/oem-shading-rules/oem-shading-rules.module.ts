import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemShadingRule } from './oem-shading-rule.entity';
import { OemShadingRulesService } from './oem-shading-rules.service';
import { OemShadingRulesController } from './oem-shading-rules.controller';
import { OemActionLogEntity } from '../../oem-action-logs/oem-action-log.entity';
import { IsShadingRuleExists } from './oem-shading-rule.validators/is-shading-rule-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([OemShadingRule, OemActionLogEntity])],
  providers: [OemShadingRulesService, IsShadingRuleExists],
  exports: [OemShadingRulesService, IsShadingRuleExists],
  controllers: [OemShadingRulesController],
})
export class OemShadingRulesModule {}
