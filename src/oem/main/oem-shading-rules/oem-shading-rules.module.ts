import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemShadingRule } from './oem-shading-rule.entity';
import { OemShadingRulesService } from './oem-shading-rules.service';
import { OemShadingRulesController } from './oem-shading-rules.controller';
import { OemActionLogEntity } from '../oem-action-logs/oem-action-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OemShadingRule, OemActionLogEntity])],
  providers: [OemShadingRulesService],
  exports: [OemShadingRulesService],
  controllers: [OemShadingRulesController],
})
export class OemShadingRulesModule {}
