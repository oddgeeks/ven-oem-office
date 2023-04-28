import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemDiscountRuleEntity } from '../../main/oem-rules/oem-discount-rules/oem-discount-rule.entity';
import { DiscountRuleTypeEnum } from '../../main/oem-rules/oem-discount-rules/oem-discount-rule.enums/discount-rule.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemDiscountRules implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const ownerUserId = companyId == 1 ? 1 : 2;
      const discountRules: Partial<OemDiscountRuleEntity>[] = [
        {
          companyId,
          ownerUserId,
          discountRuleName: '5% for over 200 SaaS Users',
          discountRuleLogic: {
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
                value: '199',
                valueTo: null,
                matchRule: 'contains',
                scopeCriteria: 'the-same-line-item',
                connectionType: 'then',
                operationCriteria: 'greater-than',
              },
            ],
            consequent: [
              {
                value: '5',
                scopeCriteria: 'apply-discount-of',
                operationCriteria: 'to-the-following-discount-element',
                operationCriteriaValue: 1,
                appliedOperationCriteria: 'choose-highest-discount',
              },
            ],
          } as any,
          discountRuleType: DiscountRuleTypeEnum.CUSTOMER,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          ownerUserId,
          discountRuleName: 'SaaS 10% Term Discount - over 3 years',
          discountRuleLogic: {
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
                unit: 'years',
                scope: 'term-length',
                value: '3',
                valueTo: null,
                matchRule: 'contains',
                scopeCriteria: 'the-same-line-item',
                connectionType: 'then',
                operationCriteria: 'greater-than',
              },
            ],
            consequent: [
              {
                value: '10',
                scopeCriteria: 'apply-discount-of',
                operationCriteria: 'to-the-following-discount-element',
                operationCriteriaValue: 1,
                appliedOperationCriteria: 'choose-highest-discount',
              },
            ],
          } as any,
          discountRuleType: DiscountRuleTypeEnum.PROMOTIONS,
          isEnabled: true,
          isActive: true,
        },
      ];

      const discountRuleEntities = await seedEntities(
        connection,
        OemDiscountRuleEntity,
        discountRules,
      );

      return discountRuleEntities;
    }
  };
