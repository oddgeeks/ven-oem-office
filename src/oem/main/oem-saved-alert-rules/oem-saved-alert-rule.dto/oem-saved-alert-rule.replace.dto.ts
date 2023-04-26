import { OmitType } from '@nestjs/swagger';
import { OemSavedAlertRuleDto } from './oem-saved-alert-rule.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class SavedAlertRuleReplaceDto extends OmitType(OemSavedAlertRuleDto, [
  'savedAlertRuleId',
  'isEnabled',
  'companyId',
  'createdAt',
  'updatedAt',
  'company',
  'user',
]) {}

export { SavedAlertRuleReplaceDto as OemSavedAlertRuleReplaceDto };
