import { OmitType } from '@nestjs/swagger';
import { OemCompanyProgramDto } from './oem-company-program.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CompanyProgramCreateDto extends OmitType(OemCompanyProgramDto, [
  'companyProgramId',
  'companyId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'channel',
  'companyChannel',
]) {}

export { CompanyProgramCreateDto as OemCompanyProgramCreateDto };
