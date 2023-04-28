import { OmitType } from '@nestjs/swagger';
import { OemSavedAlertRuleDto } from './oem-saved-alert-rule.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class SavedAlertRuleCreateDto extends OmitType(OemSavedAlertRuleDto, [
  'savedAlertRuleId',
  'isEnabled',
  'companyId',
  'createdAt',
  'updatedAt',
  'company',
  'user',
]) {}

export { SavedAlertRuleCreateDto as OemSavedAlertRuleCreateDto };
