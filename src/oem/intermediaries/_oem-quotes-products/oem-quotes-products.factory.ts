import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import * as moment from 'moment-timezone';

import { QuotesProducts } from './oem-quotes-products.entity';
import { PaymentTermEnum } from './oem-quotes-products.enums/payment-term.enum';

define(QuotesProducts, () => {
  const quotesProducts: QuotesProducts = new QuotesProducts();

  quotesProducts.productId = 1;
  quotesProducts.quoteId = 1;
  quotesProducts.lockedFields = { test: faker.word.noun() };
  quotesProducts.invoiceSchedule = { test: faker.word.noun() };
  quotesProducts.isLocked = false;
  quotesProducts.paymentTerm = PaymentTermEnum.NET_15;
  quotesProducts.quantity = faker.datatype.number({ min: 1, max: 999 });
  quotesProducts.companyId = 1;

  const now = moment.utc();
  quotesProducts.startDate = now.toDate();
  quotesProducts.endDate = now.clone().add(10, 'days').toDate();

  return quotesProducts;
});
