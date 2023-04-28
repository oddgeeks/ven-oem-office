import { define } from 'typeorm-seeding';
import { ShadingRule } from './oem-shading-rule.entity';
import { faker } from '@faker-js/faker';

define(ShadingRule, () => {
  const shadingRule = new ShadingRule();
  shadingRule.companyId = 1;
  shadingRule.ownerUserId = 1;
  shadingRule.priority = 1;
  shadingRule.shadingRuleName = faker.word.noun();
  const shadingRuleLogic = {
    antecedent: [
      {
        type: 'AND',
        pre_quantifier: 'any single line item',
        predicate: 'contains',
        post_quantifier: 'the following products',
      },
      {
        type: 'AND',
        pre_quantifier: 'quantity',
        predicate: 'less than',
        post_quantifier: '10%',
      },
    ],
    consequent: [
      {
        type: 'AND',
        pre_quantifier: 'the entire quote',
        predicate: 'should',
        operation: 'shade red',
      },
    ],
  };
  shadingRule.shadingRuleLogic = shadingRuleLogic;
  shadingRule.isActive = true;
  shadingRule.isEnabled = true;
  return shadingRule;
});
