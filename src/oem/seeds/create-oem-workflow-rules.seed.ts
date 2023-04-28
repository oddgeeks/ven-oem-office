import { Factory, Seeder } from 'typeorm-seeding';
import { OemWorkflowRule } from '../main/oem-rules/oem-workflow-rules/oem-workflow-rule.entity';
import { Connection } from 'typeorm';

export default class CreateOemWorkflowRules implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const logic: any = {
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
    };

    return factory(OemWorkflowRule)().create({
      workflowRuleLogic: logic,
    });
  }
}
