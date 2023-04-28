import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemVacationRule } from './oem-vacation-rule.entity';
import { OemVacationRulesService } from './oem-vacation-rules.service';
import { OemVacationRulesController } from './oem-vacation-rules.controller';
import { OemVacationRulesSubscriber } from './oem-vacation-rules.subscriber';
import { IsVacationRuleExists } from './oem-vacation-rule.validators/is-vacation-rule-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([OemVacationRule])],
  providers: [
    OemVacationRulesService,
    //OemVacationRulesSubscriber,
    IsVacationRuleExists,
  ],
  exports: [OemVacationRulesService, IsVacationRuleExists],
  controllers: [OemVacationRulesController],
})
export class OemVacationRulesModule {
}
