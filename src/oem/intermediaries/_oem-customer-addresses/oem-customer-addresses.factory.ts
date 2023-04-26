import { define } from 'typeorm-seeding';
import { OemCustomerAddresses } from './oem-customer-addresses.entity';

define(OemCustomerAddresses, () => {
  const customerAddresses = new OemCustomerAddresses();

  customerAddresses.companyId = 1;
  customerAddresses.addressId = 1;
  customerAddresses.customerId = 1;

  return customerAddresses;
});
