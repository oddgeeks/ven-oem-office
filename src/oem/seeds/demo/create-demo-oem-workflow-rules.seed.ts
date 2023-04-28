import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemWorkflowRule } from '../../main/oem-rules/oem-workflow-rules/oem-workflow-rule.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemWorkflowRules implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const workflowRules: Partial<OemWorkflowRule>[] = [
        {
          companyId,
          ownerUserId: 2,
          workflowRuleName: 'Catchall - No Approver',
          workflowRuleLogic: {
            antecedent: [
              {
                unit: 'value',
                scope: 'internal-comments-field',
                value: 'QA',
                valueTo: null,
                matchRule: 'contains',
                scopeCriteria: 'a-submitted-quote',
                connectionType: 'then',
                operationCriteria: 'equal-to',
              },
            ],
            consequent: [
              {
                value: [2],
                scopeCriteria: 'route-for-approval-to',
              },
            ],
          } as any,
          isActive: true,
          isCatchall: true,
          isEnabled: true,
        },
        {
          companyId,
          ownerUserId: 2,
          workflowRuleName: 'QtyLessThan100',
          workflowRuleLogic: {
            antecedent: [
              {
                unit: 'units',
                scope: 'quantity',
                value: '100',
                valueTo: null,
                matchRule: 'contains',
                scopeCriteria: 'a-line-item-in-a-submitted-quote',
                connectionType: 'then',
                operationCriteria: 'less-than',
              },
            ],
            consequent: [
              { value: [2], scopeCriteria: 'route-for-approval-to' },
            ],
          } as any,
          isActive: true,
          isCatchall: false,
          isEnabled: true,
        },
      ];

      const workflowRuleEntities = await seedEntities(
        connection,
        OemWorkflowRule,
        workflowRules,
      );

      return workflowRuleEntities;
    }
  };
