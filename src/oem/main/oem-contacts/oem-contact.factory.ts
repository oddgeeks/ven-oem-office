import { define } from 'typeorm-seeding';
import { Contact } from './oem-contact.entity';
import { faker } from '@faker-js/faker';
import { ContactTypeEnum } from './oem-contact.enums/contact-type.enum';

define(Contact, () => {
  const contact = new Contact();
  contact.contactId = 1;
  // contact.contactType = ContactTypeEnum.CHANNEL;
  contact.companyOrganisationName = faker.company.companyName();
  contact.jobTitle = faker.word.verb();
  contact.lastName = faker.name.lastName();
  contact.firstName = faker.name.firstName();
  contact.contactEmail = faker.internet.email();
  contact.phone = faker.phone.phoneNumber('+1 929 27#-####');
  contact.isEnabled = true;
  contact.companyId = 1;
  return contact;
});
