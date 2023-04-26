import { define } from 'typeorm-seeding';
import { CompanyAddresses } from './oem-company-addresses.entity';

define(CompanyAddresses, (context) => {
  const companyAddresses = new CompanyAddresses();
  companyAddresses.addressId = 1;
  companyAddresses.companyId = 1;
  return companyAddresses;
});
