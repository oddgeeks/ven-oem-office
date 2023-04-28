import { define } from 'typeorm-seeding';
import { OemSavedAlertRule } from './oem-saved-alert-rule.entity';
import { faker } from '@faker-js/faker';
import { QuantifiersEnum } from './oem-saved-alert-rule.enums/quantifiers.enum';
import { PredicatesEnum } from './oem-saved-alert-rule.enums/predicates.enum';

define(OemSavedAlertRule, () => {
  const savedAlertRule = new OemSavedAlertRule();

  savedAlertRule.companyId = 1;
  savedAlertRule.userId = 1;
  savedAlertRule.name = faker.word.noun();
  savedAlertRule.isCatchAll = true;

  savedAlertRule.ruleLogic = {
    antecedent: [
      {
        type: 'AND',
        pre_quantifier: QuantifiersEnum.A_SUBMITTED_QUOTE,
        predicate: PredicatesEnum.CONTAINS,
        post_quantifier: QuantifiersEnum.THE_FOLLOWING_PRODUCTS,
      },
      {
        type: 'AND',
        pre_quantifier: QuantifiersEnum.THE_FOLLOWING_PRODUCTS,
        predicate: PredicatesEnum.ARE,
        post_quantifier: QuantifiersEnum.ADDON,
      },
    ],
    consequent: [
      {
        type: 'test',
        pre_quantifier: 'approval emails',
        predicate: 'should',
        operation: 'be routed to',
        post_quantifier: 'owner',
      },
    ],
  };

  return savedAlertRule;
});
