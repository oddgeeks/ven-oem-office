import { define } from 'typeorm-seeding';
import { QuotesCustomerProducts } from './oem-quotes-customer-products.entity';
import { faker } from '@faker-js/faker';

define(QuotesCustomerProducts, () => {
  const quotesProducts: QuotesCustomerProducts = new QuotesCustomerProducts();
  quotesProducts.customerProductId = 1;
  quotesProducts.quoteId = 1;
  quotesProducts.lockedFields = { test: faker.word.noun() };
  quotesProducts.isLocked = false;
  quotesProducts.companyId = 1;
  return quotesProducts;
});
