import { OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { OemCompanyProgramDto } from './oem-company-program.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CompanyProgramUpdateDto extends OmitType(OemCompanyProgramDto, [
  'companyProgramId',
  'companyId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'channel',
  'companyChannel',
]) {
  @IsOptional()
  channelId: number;

  @IsOptional()
  name: string;
}

export { CompanyProgramUpdateDto as OemCompanyProgramUpdateDto };
