import { OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { VacationRuleDto } from './oem-vacation-rule.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class VacationRuleUpdateDto extends OmitType(VacationRuleDto, [
  'vacationRuleId',
  'companyId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'sourceUser',
  'targetUser',
] as const) {
  @IsOptional()
  name: string;

  @IsOptional()
  sourceUserId: number;

  @IsOptional()
  targetUserId: number;
}

export { VacationRuleUpdateDto as OemVacationRuleUpdateDto };
