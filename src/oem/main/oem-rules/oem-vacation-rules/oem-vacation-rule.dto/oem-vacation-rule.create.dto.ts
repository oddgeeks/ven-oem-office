import { OmitType } from '@nestjs/swagger';

import { VacationRuleDto } from './oem-vacation-rule.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class VacationRuleCreateDto extends OmitType(VacationRuleDto, [
  'vacationRuleId',
  'companyId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'sourceUser',
  'targetUser',
] as const) {}

export { VacationRuleCreateDto as OemVacationRuleCreateDto };
