import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemWorkflowRule } from './oem-workflow-rule.entity';
import { OemWorkflowRulesService } from './oem-workflow-rules.service';
import { OemWorkflowRulesController } from './oem-workflow-rules.controller';
import { OemProductEntity } from '../../oem-products/oem-product.entity';
import { OemHierarchyEntity } from '../../oem-hierarchies/oem-hierarchy.entity';
import { WorkflowRuleLogicConfig } from './oem-workflow-rule.validators/workflow-rule-logic.validator.config';
import { IsWorkflowRuleLogicValid } from './oem-workflow-rule.validators/workflow-rule-logic.validator';
import { OemUserEntity } from '../../oem-users/oem-user.entity';
import { TenantsService } from '../../../../shared/tenants/tenants.service';
import { OemActionLogEntity } from '../../oem-action-logs/oem-action-log.entity';
import { IsWorkflowRuleExists } from './oem-workflow-rule.validators/is-workflow-rule-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OemWorkflowRule,
      OemProductEntity,
      OemHierarchyEntity,
      OemActionLogEntity,
      /*      OemUserEntity,*/
    ]),
  ],
  providers: [
    OemWorkflowRulesService,
    IsWorkflowRuleExists,
    //Disabled bc frontend uses its own
    /*IsWorkflowRuleLogicValid,
    {
      provide: 'CONFIGS',
      useValue: WorkflowRuleLogicConfig,
    },*/
  ],
  exports: [OemWorkflowRulesService, IsWorkflowRuleExists],
  controllers: [OemWorkflowRulesController],
})
export class OemWorkflowRulesModule {
}
