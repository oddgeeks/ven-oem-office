import { PartialType } from '@nestjs/swagger';

import { CompanyChannelAddressEntity } from '../oem-company-channel-addresses.entity';
import { CompanyChannelAddressDto } from './oem-company-channel-addresses.dto';

export class CompanyChannelAddressSerializeDto extends PartialType(
  CompanyChannelAddressDto,
) {
  constructor(data: Partial<CompanyChannelAddressEntity> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { CompanyChannelAddressSerializeDto as OemCompanyChannelAddressesSerializeDto };
