import { QuantifiersEnum } from '../oem-workflow-rule.enums/quantifiers.enum';
import { PredicatesEnum } from '../oem-workflow-rule.enums/predicates.enum';

export type AntecedentType = {
  type: string;
  pre_quantifier: QuantifiersEnum;
  predicate: PredicatesEnum;
  post_quantifier: QuantifiersEnum;
};
