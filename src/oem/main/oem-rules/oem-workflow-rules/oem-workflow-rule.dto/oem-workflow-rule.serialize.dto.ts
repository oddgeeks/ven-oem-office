import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { WorkflowRule } from '../oem-workflow-rule.entity';
import { WorkflowRuleDto } from './oem-workflow-rule.dto';

export class WorkflowRuleSerializeDto extends PartialType(WorkflowRuleDto) {
  constructor(data: Partial<WorkflowRule> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { WorkflowRuleSerializeDto as OemWorkflowRuleSerializeDto };
