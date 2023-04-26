import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

import { SalesforceIntegrationDto } from './oem-salesforce-integration.dto/oem-salesforce-integration.dto';

define(SalesforceIntegrationDto, () => {
  const salesforceIntegration: SalesforceIntegrationDto =
    new SalesforceIntegrationDto();
  salesforceIntegration.companyId = 1;
  salesforceIntegration.salesforceClientId = faker.datatype.uuid();
  salesforceIntegration.salesforceClientSecret = faker.datatype.uuid();
  salesforceIntegration.salesforcePassword = faker.lorem.word(12);
  salesforceIntegration.salesforceURL = faker.internet.url();
  salesforceIntegration.salesforceUsername = faker.internet.email();
  salesforceIntegration.isEnabled = true;
  return salesforceIntegration;
});
