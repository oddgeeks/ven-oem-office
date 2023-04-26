import { OemCompanyDto } from './oem-company.dto';
import { PartialType } from '@nestjs/swagger';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CompanySerializeDto extends PartialType(OemCompanyDto) {}

export { CompanySerializeDto as OemCompanySerializeDto };
