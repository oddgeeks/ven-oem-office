import { PredicatesEnum } from '../oem-saved-alert-rule.enums/predicates.enum';
import { QuantifiersEnum } from '../oem-saved-alert-rule.enums/quantifiers.enum';

export type SavedAlertRuleLogicConditionConfigType = {
  predicates: Array<PredicatesEnum>;
  post_quantifiers: Array<QuantifiersEnum> | QuantifiersEnum;
};
