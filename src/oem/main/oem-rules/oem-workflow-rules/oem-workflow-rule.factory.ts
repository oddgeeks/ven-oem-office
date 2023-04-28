import { define } from 'typeorm-seeding';
import { WorkflowRule } from './oem-workflow-rule.entity';
import { WorkflowRuleLogicType } from './oem-workflow-rule.type/workflow-rule-logic.type';

interface Context {
  companyId?: number;
  ownerUserId?: number;
  workflowRuleName?: string;
  isCatchall?: boolean;
  workflowRuleLogic?: WorkflowRuleLogicType;
}

define(WorkflowRule, (faker_, context: Context) => {
  const workflowRule: WorkflowRule = new WorkflowRule();
  workflowRule.companyId = context?.companyId || 1;
  workflowRule.ownerUserId = context?.ownerUserId || 1;
  workflowRule.workflowRuleName =
    context?.workflowRuleName || 'Catchall - No Approver';
  workflowRule.isCatchall = context?.isCatchall || true;
  const workflowRuleLogic = context?.workflowRuleLogic || {
    antecedent: [],
    consequent: [],
  };
  workflowRule.workflowRuleLogic = workflowRuleLogic as WorkflowRuleLogicType;
  workflowRule.isActive = true;
  return workflowRule;
});
