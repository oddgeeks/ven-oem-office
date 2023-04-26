import { PartialType } from '@nestjs/swagger';

import { OemCompanyAddressesEntity } from '../oem-company-addresses.entity';
import { CompanyAddressesDto } from './oem-company-addresses.dto';

export class CompanyAddressesSerializeDto extends PartialType(
  CompanyAddressesDto,
) {
  constructor(data: Partial<OemCompanyAddressesEntity> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { CompanyAddressesSerializeDto as OemCompanyAddressesSerializeDto };
