import { OemCompanyAddressesDto } from './oem-company-addresses.dto';
import { OemCompanyAddressesSerializeDto } from './oem-company-addresses.serialize.dto';

export const dto = {
  update: OemCompanyAddressesDto,
  replace: OemCompanyAddressesDto,
  create: OemCompanyAddressesDto,
};

export const serialize = {
  get: OemCompanyAddressesSerializeDto,
  many: OemCompanyAddressesSerializeDto,
};
