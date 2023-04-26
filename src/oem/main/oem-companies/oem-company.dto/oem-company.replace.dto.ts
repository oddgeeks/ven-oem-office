import { OmitType } from '@nestjs/swagger';
import { OemCompanyDto } from './oem-company.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CompanyReplaceDto extends OmitType(OemCompanyDto, [
  'companyId',
  'createdAt',
  'updatedAt',
  'isEnabled',
  'roles',
  'companyAddress',
] as const) {}

export { CompanyReplaceDto as OemCompanyReplaceDto };
