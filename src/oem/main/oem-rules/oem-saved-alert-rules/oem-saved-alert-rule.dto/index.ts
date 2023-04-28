import { OemSavedAlertRuleCreateDto } from './oem-saved-alert-rule.create.dto';
import { OemSavedAlertRuleReplaceDto } from './oem-saved-alert-rule.replace.dto';
import { OemSavedAlertRuleUpdateDto } from './oem-saved-alert-rule.update.dto';
import { OemSavedAlertRuleSerializeDto } from './oem-saved-alert-rule.serialize.dto';

export const dto = {
  create: OemSavedAlertRuleCreateDto,
  update: OemSavedAlertRuleUpdateDto,
  replace: OemSavedAlertRuleReplaceDto,
};

export const serialize = {
  get: OemSavedAlertRuleSerializeDto,
  getMany: OemSavedAlertRuleSerializeDto,
};
