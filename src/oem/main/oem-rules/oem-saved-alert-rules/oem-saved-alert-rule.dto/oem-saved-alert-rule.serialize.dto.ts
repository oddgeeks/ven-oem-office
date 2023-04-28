import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { SavedAlertRule } from '../oem-saved-alert-rule.entity';
import { SavedAlertRuleDto } from './oem-saved-alert-rule.dto';

export class SavedAlertRuleSerializeDto extends PartialType(SavedAlertRuleDto) {
  constructor(data: Partial<SavedAlertRule> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { SavedAlertRuleSerializeDto as OemSavedAlertRuleSerializeDto };
