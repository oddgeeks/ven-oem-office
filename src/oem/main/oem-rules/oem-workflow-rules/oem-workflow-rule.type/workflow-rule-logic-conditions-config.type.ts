import { PredicatesEnum } from '../oem-workflow-rule.enums/predicates.enum';
import { QuantifiersEnum } from '../oem-workflow-rule.enums/quantifiers.enum';

export type WorkflowRuleLogicConditionConfigType = {
  predicates: Array<PredicatesEnum>;
  post_quantifiers: Array<QuantifiersEnum> | QuantifiersEnum;
};
