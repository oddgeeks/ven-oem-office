import { PartialType } from '@nestjs/swagger';

import { OemCustomerAddresses } from '../oem-customer-addresses.entity';
import { CustomerAddressesDto } from './oem-customer-addresses.dto';

export class CustomerAddressesSerializeDto extends PartialType(
  CustomerAddressesDto,
) {
  constructor(data: Partial<OemCustomerAddresses> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { CustomerAddressesSerializeDto as OemCustomerAddressesSerializeDto };
