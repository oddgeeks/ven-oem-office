import { define } from 'typeorm-seeding';
import { Customer } from './oem-customer.entity';
import { faker } from '@faker-js/faker';

define(Customer, () => {
  const customer = new Customer();

  customer.companyId = 1;
  customer.licensingProgramId = 1;
  customer.organizationId = faker.datatype.uuid();
  customer.salesOrganizationId = faker.datatype.uuid();
  customer.customerName = faker.name.firstName() + faker.name.lastName();
  customer.industry = 'Vehicle';
  customer.customerEmail = faker.internet.email();
  customer.logoUrl = faker.image.imageUrl();
  customer.phone = faker.phone.phoneNumber('+1 929 27#-####');
  customer.isEnabled = true;

  return customer;
});
