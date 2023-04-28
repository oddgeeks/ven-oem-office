import { PartialType } from '@nestjs/swagger';

import { OemVacationRuleDto } from './oem-vacation-rule.dto';
import { OemVacationRule } from '../oem-vacation-rule.entity';

export class VacationRuleSerializeDto extends PartialType(OemVacationRuleDto) {
  constructor(data: Partial<OemVacationRule> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { VacationRuleSerializeDto as OemVacationRuleSerializeDto };
