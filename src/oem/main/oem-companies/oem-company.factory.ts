import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Company } from './oem-company.entity';
import { PermitCreditCardsEnum } from './oem-company.enums/permit-credit-cards.enum';

define(Company, (faker_) => {
  const company = new Company();

  company.companyName = 'Demo & Co.';
  company.companyEmail = faker.internet.email();//'Nelle_Luettgen97@hotmail.com';
  company.websiteUrl = 'https://demo.vendori.com';
  company.logoUrl =
    'https://files.vendori.com/images/33660502-30b1-499a-ad87-bbf525c0b3c9.png?Expires=1705460746&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9maWxlcy52ZW5kb3JpLmNvbS9pbWFnZXMvMzM2NjA1MDItMzBiMS00OTlhLWFkODctYmJmNTI1YzBiM2M5LnBuZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTcwNTQ2MDc0Nn19fV19&Signature=czG8lRcQs7d5BxFeG48l9qLagla4ZmKn7v~~0FChMom0jban27upjLw8l5RO0xsa8Kq8~CbdnwGr~jdivqt4VpbozKpeJleLeRZeD66-XCUFckAz59dytOCTXkbugFqAla5T8jVSyLjtsAOrf4GWBf1muJdwNAirIAjkMEopduX3mhOSqIyFnMZXUiXjcjf3OSjkjcw-NvFR4gWB3QpxrijDDq47793fqVszcF92lbBDst18AN1s9jQ5pFuAxrXrRwjxDOiVapu5AD6-PkE7JBrx43MM0EAGISmPZ6GY4Xs6wHt4O~YQOLDSw7trKv64tTs05ieRaoy4OjvYKZGY7A__&Key-Pair-Id=K3W4UV0J4B6YE7';
  company.defaultQuoteExpiration = 90;
  company.bankName = 'Local Bank #1';
  company.bankAccountNumber = '01234567890';
  company.phone = '+1 (123) 456-7890';
  company.bankRoutingNumber = '123456789';
  company.dealAttributes = [
    'Net New',
    'Expansion',
    'Renewal',
    'Custom Billing',
    'Custom Discount',
  ];
  company.settings = {
    customListPriceName: 'List Price',
    customCustomerPriceName: 'Price To Customer',
    companyPrimaryColor: {
      a: 1,
      r: 74,
      g: 137,
      b: 187,
    },
    startingQuoteNumber: 1,
  };
  company.permitCreditCards = PermitCreditCardsEnum.ALL_PRODUCTS;
  company.isPermitSigning = true;
  company.isEnabled = true;
  company.subdomain = 'demo';
  company.emailDomain = `bloodandtreasure,vendori`;

  return company;
});
