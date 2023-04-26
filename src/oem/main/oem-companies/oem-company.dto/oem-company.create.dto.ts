import { OmitType } from '@nestjs/swagger';
import { OemCompanyDto } from './oem-company.dto';
import { User } from '../../oem-users/oem-user.entity';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class CompanyCreateDto extends OmitType(OemCompanyDto, [
  'companyId',
  'createdAt',
  'updatedAt',
  'roles',
  'companyAddress',
  'isEnabled',
] as const) {
  constructor(data: Partial<User> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { CompanyCreateDto as OemCompanyCreateDto };
