import { OemCustomerAddressesDto } from './oem-customer-addresses.dto';
import { OemCustomerAddressesSerializeDto } from './oem-customer-addresses.serialize.dto';

export const dto = {
  update: OemCustomerAddressesDto,
  replace: OemCustomerAddressesDto,
  create: OemCustomerAddressesDto,
};

export const serialize = {
  get: OemCustomerAddressesSerializeDto,
  many: OemCustomerAddressesSerializeDto,
};
