import { OmitType } from '@nestjs/swagger';
import { OemSavedAlertRuleDto } from './oem-saved-alert-rule.dto';
import { IsOptional } from 'class-validator';
import { SavedAlertRuleLogicType } from '../oem-saved-alert-rule.type/saved-alert-rule-logic.type';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class SavedAlertRuleUpdateDto extends OmitType(OemSavedAlertRuleDto, [
  'savedAlertRuleId',
  'companyId',
  'userId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'user',
]) {
  @IsOptional()
  name: string;

  @IsOptional()
  ruleLogic: SavedAlertRuleLogicType;
}

export { SavedAlertRuleUpdateDto as OemSavedAlertRuleUpdateDto };
