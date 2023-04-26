import { SavedAlertRuleLogicConditionConfigType } from './saved-alert-rule-logic-conditions-config.type';

export type SavedAlertRuleLogicConfigType = {
  pre_quantifiers: Array<string>;
  conditions: Array<SavedAlertRuleLogicConditionConfigType>;
};
