import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import * as moment from 'moment-timezone';

import { Quote } from './oem-quote.entity';
import { DealTypeEnum } from './oem-quote.enums/deal-type.enum';
import { QuoteStatusEnum } from './oem-quote.enums/quote-status.enum';

define(Quote, () => {
  const quote = new Quote();

  quote.companyId = 1;
  quote.ownerUserId = 1;
  quote.customerId = 1;
  quote.geoHierarchyId = 1;
  quote.quoteUuid = faker.datatype.uuid();
  quote.opportunityId = faker.datatype.uuid();
  quote.quoteName = faker.company.companySuffix();
  quote.netAmount = faker.datatype.number(500);
  quote.quoteStatus = QuoteStatusEnum.DRAFT;
  quote.dealType = DealTypeEnum.DIRECT;
  quote.currency = faker.finance.currencyCode();
  quote.quoteComments = faker.lorem.slug(10);
  quote.quoteInternalComments = faker.lorem.slug(10);
  quote.quoteAttributes = [{ name: 'Attribute1', value: 'value1' }];
  (quote.quoteCommentSettings = {
    quoteDefaultComment:
      'This Quote is Valid Until {{expiresAt}}. “Pending” quotes require internal review before approval.',
    consumptionMessage:
      'Quoted consumption offerings do not reflect contractually agreed upon delivery or invoice schedules. Displayed pricing is reflective of implied consumption rates and may change depending on product pricing.',
  }),
    (quote.quoteInternalCommentFiles = [
      {
        name: 'Test',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ]);
  quote.pdfFileUrl = faker.image.business() + '.pdf';
  quote.excelFileUrl = faker.image.business() + '.excel';
  quote.isAcceptingCreditCard = faker.datatype.boolean();
  quote.isExternal = faker.datatype.boolean();
  quote.isBlackBox = faker.datatype.boolean();
  quote.isRequiringSigning = faker.datatype.boolean();
  quote.isDistributorVisible = true;
  quote.isResellerVisible = true;
  quote.isExternalHideContact = true;
  quote.isExternalHideInvoice = true;
  quote.isExternalHideUnit = true;
  quote.isLocked = false;
  quote.isEnabled = true;
  quote.isPrimary = false;
  quote.expiresAt = moment.utc().add(3, 'months').toDate();

  return quote;
});
