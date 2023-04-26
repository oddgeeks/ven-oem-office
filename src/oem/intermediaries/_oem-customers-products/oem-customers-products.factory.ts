import { define } from 'typeorm-seeding';
import { CustomersProducts } from './oem-customers-products.entity';
import { faker } from '@faker-js/faker';

define(CustomersProducts, () => {
  const customerProducts: CustomersProducts = new CustomersProducts();
  customerProducts.productId = 1;
  customerProducts.customerId = 1;
  customerProducts.quantity = faker.datatype.number({ max: 9999 });
  customerProducts.endDate = new Date();
  customerProducts.customerPrice = 500;
  customerProducts.netPrice = 300;
  customerProducts.companyId = 1;
  return customerProducts;
});
