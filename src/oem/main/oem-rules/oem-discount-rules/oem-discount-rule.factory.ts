import { define } from 'typeorm-seeding';
import { DiscountRule } from './oem-discount-rule.entity';
import { DiscountRuleLogicType } from './oem-discount-rule.types/discount-rule-logic.type';
import { DiscountRuleTypeEnum } from './oem-discount-rule.enums/discount-rule.enum';
import { faker } from '@faker-js/faker';

define(DiscountRule, (context) => {
  const DISCOUNT_RULE_TYPE = Object.keys(DiscountRuleTypeEnum);
  const discountRule = new DiscountRule();
  discountRule.discountRuleId = 1;
  discountRule.companyId = 1;
  discountRule.ownerUserId = 1;
  discountRule.discountRuleName = faker.word.noun();
  discountRule.discountRuleType =
    DiscountRuleTypeEnum[
      DISCOUNT_RULE_TYPE[Math.floor(Math.random() * DISCOUNT_RULE_TYPE.length)]
    ];
  discountRule.isActive = true;
  const discountRuleLogic = {
    antecedent: [
      {
        type: 'AND',
        pre_quantifier: 'If a quote being created',
        predicate: 'Was sold by',
        post_quantifier: 'the following Sales Team',
      },
      {
        type: 'AND',
        pre_quantifier: 'Geo Hierarchy',
        predicate: 'Not Equal to',
        post_quantifier: '10%',
      },
    ],
    consequent: [
      {
        operation: 'Apply a discount',
        predicate: 0.2,
        post_quantifier: [1, 2, 3, 4, 5],
      },
    ],
  };
  discountRule.discountRuleLogic =
    discountRuleLogic as unknown as DiscountRuleLogicType;
  return discountRule;
});
