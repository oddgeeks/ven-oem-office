import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { OemAddressEntity } from './oem-address.entity';
import { AddressTypeEnum } from './oem-address.enums/address-type.enum';

interface Context {
  companyId?: number;
  address_1?: string;
  address_2?: string;
  address_3?: string;
  city?: string;
  zipCode?: string;
  region?: string;
  country?: string;
  phone?: string;
  email?: string;
  addressType: AddressTypeEnum;
  /*isBilling?: boolean;
  isShipping?: boolean;*/
}

define(OemAddressEntity, (faker_, context: Context) => {
  const address = new OemAddressEntity();

  address.companyId = context?.companyId || 1;
  address.address_1 = context?.address_1 || faker.address.secondaryAddress();
  address.address_2 = context?.address_2 || faker.address.secondaryAddress();
  address.address_3 = context?.address_3 || faker.address.secondaryAddress();
  address.city = context?.city || faker.address.city();
  address.zipCode = context?.zipCode || faker.address.zipCode();
  address.region = context?.region || faker.address.state();
  address.country = context?.country || faker.address.county();
  address.phone = context?.phone || faker.phone.phoneNumber('+1 929 27#-####');
  address.email = context?.email || faker.internet.email();
  /*address.isBilling = context?.isBilling || faker.datatype.boolean();
  address.isShipping = context?.isShipping || faker.datatype.boolean();*/
  address.addressType =
    context?.addressType || Math.random() > 0.5
      ? AddressTypeEnum.BILLING
      : AddressTypeEnum.SHIPPING;

  return address;
});
