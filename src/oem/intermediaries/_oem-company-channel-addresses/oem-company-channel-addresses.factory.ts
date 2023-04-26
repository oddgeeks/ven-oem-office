import { define } from 'typeorm-seeding';
import { OemCompanyChannelAddresses } from './oem-company-channel-addresses.entity';

define(OemCompanyChannelAddresses, () => {
  const customerAddresses = new OemCompanyChannelAddresses();

  customerAddresses.companyId = 1;
  customerAddresses.addressId = 1;
  customerAddresses.channelId = 1;

  return customerAddresses;
});
