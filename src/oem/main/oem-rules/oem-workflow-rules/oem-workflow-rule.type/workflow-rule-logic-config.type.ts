import { WorkflowRuleLogicConditionConfigType } from './workflow-rule-logic-conditions-config.type';

export type WorkflowRuleLogicConfigType = {
  pre_quantifiers: Array<string>;
  conditions: Array<WorkflowRuleLogicConditionConfigType>;
};
