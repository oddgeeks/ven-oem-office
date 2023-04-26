import { OmitType } from '@nestjs/swagger';
import { WorkflowRuleDto } from './oem-workflow-rule.dto';
import { IsOptional } from 'class-validator';
import { WorkflowRuleLogicType } from '../oem-workflow-rule.type/workflow-rule-logic.type';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class WorkflowRuleUpdateDto extends OmitType(WorkflowRuleDto, [
  'workflowRuleId',
  'companyId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'ownerUser',
] as const) {
  @IsOptional()
  companyId: number;
  @IsOptional()
  ownerUserId: number;
  @IsOptional()
  workflowRuleName: string;
  @IsOptional()
  workflowRuleLogic: WorkflowRuleLogicType;
  @IsOptional()
  isActive: boolean;
  @IsOptional()
  isCatchall: boolean;
}

export { WorkflowRuleUpdateDto as OemWorkflowRuleUpdateDto };
