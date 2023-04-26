import { OemCompanyChannelAddressesDto } from './oem-company-channel-addresses.dto';
import { OemCompanyChannelAddressesSerializeDto } from './oem-company-channel-addresses.serialize.dto';

export const dto = {
  update: OemCompanyChannelAddressesDto,
  replace: OemCompanyChannelAddressesDto,
  create: OemCompanyChannelAddressesDto,
};

export const serialize = {
  get: OemCompanyChannelAddressesSerializeDto,
  many: OemCompanyChannelAddressesSerializeDto,
};
