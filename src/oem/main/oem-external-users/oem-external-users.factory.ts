import { define } from 'typeorm-seeding';
import {
  ExternalUser,
  OemExternalUserEntity,
} from './oem-external-user.entity';
import { faker } from '@faker-js/faker';
import { ExternalUserTypeEnum } from './oem-external-user.enums/external-user-type.enum';

interface Context {
  companyId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyOrganisationName?: string;
  externalUserType: ExternalUserTypeEnum;
  isEnabled?: boolean;
}

define(ExternalUser, (faker_, context: Context) => {
  const user: OemExternalUserEntity = new ExternalUser();

  user.companyId = context?.companyId || 1;
  user.firstName = context?.firstName || faker.name.firstName();
  user.lastName = context?.lastName || faker.name.lastName();
  user.email = context?.email || faker.internet.email();
  user.phone = context?.phone || faker.phone.phoneNumber('+1 929 27#-####');
  user.isEnabled = context?.isEnabled || true;
  user.externalUserType =
    context?.externalUserType || ExternalUserTypeEnum.DISTRIBUTOR_CONTACT;
  user.companyOrganisationName =
    context?.companyOrganisationName || faker.company.companyName();

  return user;
});
