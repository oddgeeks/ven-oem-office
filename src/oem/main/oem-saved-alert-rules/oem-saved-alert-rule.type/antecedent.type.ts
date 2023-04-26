import { QuantifiersEnum } from '../oem-saved-alert-rule.enums/quantifiers.enum';
import { PredicatesEnum } from '../oem-saved-alert-rule.enums/predicates.enum';

export type AntecedentType = {
  type: string;
  pre_quantifier: QuantifiersEnum;
  predicate: PredicatesEnum;
  post_quantifier: QuantifiersEnum;
};
