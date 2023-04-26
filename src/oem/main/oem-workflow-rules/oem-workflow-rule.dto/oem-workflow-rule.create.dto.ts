import { OmitType } from '@nestjs/swagger';
import { WorkflowRuleDto } from './oem-workflow-rule.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class WorkflowRuleCreateDto extends OmitType(WorkflowRuleDto, [
  'workflowRuleId',
  'companyId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'ownerUser',
] as const) {}

export { WorkflowRuleCreateDto as OemWorkflowRuleCreateDto };
