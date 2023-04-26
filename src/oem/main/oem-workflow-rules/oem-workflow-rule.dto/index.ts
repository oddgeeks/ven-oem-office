import { OemWorkflowRuleCreateDto } from './oem-workflow-rule.create.dto';
import { OemWorkflowRuleReplaceDto } from './oem-workflow-rule.replace.dto';
import { OemWorkflowRuleUpdateDto } from './oem-workflow-rule.update.dto';
import { OemWorkflowRuleSerializeDto } from './oem-workflow-rule.serialize.dto';

export const dto = {
  create: OemWorkflowRuleCreateDto,
  update: OemWorkflowRuleUpdateDto,
  replace: OemWorkflowRuleReplaceDto,
};

export const serialize = {
  get: OemWorkflowRuleSerializeDto,
  getMany: OemWorkflowRuleSerializeDto,
};
