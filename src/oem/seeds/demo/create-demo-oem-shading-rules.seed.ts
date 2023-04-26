import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemShadingRule } from '../../main/oem-shading-rules/oem-shading-rule.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemShadingRulesSeed implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const shadingRules: Partial<OemShadingRule>[] = [
        {
          companyId,
          ownerUserId: 2,
          priority: 1,
          shadingRuleName: 'QTY100',
          shadingRuleLogic: {
            antecedent: [
              {
                unit: 'units',
                scope: 'quantity',
                value: '100',
                valueTo: null,
                matchRule: 'contains',
                scopeCriteria: 'a-line-item-in-a-quote-being-created',
                connectionType: 'then',
                operationCriteria: 'less-than',
              },
            ],
            consequent: [
              {
                value: 'Sell more',
                matchRule: 'should',
                shadingType: 'shade-red',
                scopeCriteria: 'the-violating-items',
                operationCriteria: 'and-generate-a-comment-that-reads',
              },
            ],
          } as any,
          isActive: true,
          isEnabled: false,
        },
        {
          companyId,
          ownerUserId: 2,
          priority: 1,
          shadingRuleName: 'Prod.ALessThan100',
          shadingRuleLogic: {
            antecedent: [
              {
                unit: 'units',
                scope: 'quantity',
                value: '100',
                valueTo: null,
                matchRule: 'contains',
                scopeCriteria: 'a-line-item-in-a-quote-being-created',
                connectionType: 'and',
                operationCriteria: 'less-than',
              },
              {
                unit: null,
                scope: 'the-following-products',
                value: [1],
                valueTo: null,
                matchRule: 'contains',
                scopeCriteria: 'the-same-line-item',
                connectionType: 'then',
                operationCriteria: null,
              },
            ],
            consequent: [
              {
                value: 'Sell more',
                matchRule: 'should',
                shadingType: 'shade-yellow',
                scopeCriteria: 'the-violating-items',
                operationCriteria: 'and-generate-a-comment-that-reads',
              },
            ],
          } as any,
          isActive: true,
          isEnabled: false,
        },
        {
          companyId,
          ownerUserId: 2,
          priority: 3,
          shadingRuleName: 'Non-Standard Invoice Schedule',
          shadingRuleLogic: {
            antecedent: [
              {
                unit: 'the-default-setting',
                scope: 'billing-payment-structure',
                value: '',
                valueTo: null,
                matchRule: 'contains',
                scopeCriteria: 'a-line-item-in-a-quote-being-created',
                connectionType: 'then',
                operationCriteria: 'not-equal-to',
              },
            ],
            consequent: [
              {
                value: 'Non-standard billing requires approval',
                matchRule: 'should',
                shadingType: 'shade-yellow',
                scopeCriteria: 'the-violating-items',
                operationCriteria: 'and-generate-a-comment-that-reads',
              },
            ],
          } as any,
          isActive: true,
          isEnabled: true,
        },
        {
          companyId,
          ownerUserId: 2,
          priority: 1,
          shadingRuleName: 'Less than 100 SaaS',
          shadingRuleLogic: {
            antecedent: [
              {
                unit: null,
                scope: 'the-following-products',
                value: [6, 7],
                valueTo: null,
                matchRule: 'contains',
                scopeCriteria: 'a-line-item-in-a-quote-being-created',
                connectionType: 'and',
                operationCriteria: null,
              },
              {
                unit: 'units',
                scope: 'quantity',
                value: '100',
                valueTo: null,
                matchRule: 'contains',
                scopeCriteria: 'the-same-line-item',
                connectionType: 'then',
                operationCriteria: 'less-than',
              },
            ],
            consequent: [
              {
                value: 'Must sell at least 100 users',
                matchRule: 'should',
                shadingType: 'shade-red',
                scopeCriteria: 'the-violating-items',
                operationCriteria: 'and-generate-a-comment-that-reads',
              },
            ],
          } as any,
          isActive: true,
          isEnabled: true,
        },
        {
          companyId,
          ownerUserId: 2,
          priority: 2,
          shadingRuleName: 'No Monitor Attached',
          shadingRuleLogic: {
            antecedent: [
              {
                unit: null,
                scope: 'the-following-products',
                value: [12],
                valueTo: null,
                matchRule: 'contains',
                scopeCriteria: 'a-line-item-in-a-quote-being-created',
                connectionType: 'and',
                operationCriteria: null,
              },
              {
                unit: null,
                scope: 'the-following-products',
                value: [9],
                valueTo: null,
                matchRule: 'does-not-contain',
                scopeCriteria: 'another-line-item',
                connectionType: 'then',
                operationCriteria: null,
              },
            ],
            consequent: [
              {
                value: 'Must include 36" monitor w/ Server',
                matchRule: 'should',
                shadingType: 'shade-red',
                scopeCriteria: 'the-violating-items',
                operationCriteria: 'and-generate-a-comment-that-reads',
              },
            ],
          } as any,
          isActive: true,
          isEnabled: true,
        },
      ];

      const shadingRuleEntities = await seedEntities(
        connection,
        OemShadingRule,
        shadingRules,
      );

      return shadingRuleEntities;
    }
  };
