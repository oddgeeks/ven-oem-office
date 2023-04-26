import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemVacationRule } from './oem-vacation-rule.entity';
import { OemVacationRulesService } from './oem-vacation-rules.service';
import { OemVacationRulesController } from './oem-vacation-rules.controller';
import { OemVacationRulesSubscriber } from './oem-vacation-rules.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([OemVacationRule])],
  providers: [OemVacationRulesService, OemVacationRulesSubscriber],
  exports: [OemVacationRulesService],
  controllers: [OemVacationRulesController],
})
export class OemVacationRulesModule {}
