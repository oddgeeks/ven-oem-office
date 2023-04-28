import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemSavedAlertRule } from './oem-saved-alert-rule.entity';
import { OemSavedAlertRulesService } from './oem-saved-alert-rules.service';
import { OemSavedAlertRulesController } from './oem-saved-alert-rules.controller';
import { OemProductEntity } from '../../oem-products/oem-product.entity';
import { OemHierarchyEntity } from '../../oem-hierarchies/oem-hierarchy.entity';
import { SavedAlertRuleLogicConfig } from './oem-saved-alert-rule.validators/saved-alert-rule-logic.validator.config';
import { IsSavedAlertRuleLogicValid } from './oem-saved-alert-rule.validators/saved-alert-rule-logic.validator';
import { OemUserEntity } from '../../oem-users/oem-user.entity';
import { IsSavedAlertRuleExists } from './oem-saved-alert-rule.validators/is-saved-alert-rule-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OemSavedAlertRule,
      OemProductEntity,
      OemHierarchyEntity,
      OemUserEntity,
    ]),
  ],
  providers: [
    OemSavedAlertRulesService,
    IsSavedAlertRuleLogicValid,
    IsSavedAlertRuleExists,
    {
      provide: 'CONFIGS',
      useValue: SavedAlertRuleLogicConfig,
    },
  ],
  exports: [OemSavedAlertRulesService, IsSavedAlertRuleExists],
  controllers: [OemSavedAlertRulesController],
})
export class OemSavedAlertRulesModule {}
