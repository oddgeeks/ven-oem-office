import { define } from 'typeorm-seeding';
import { User } from './oem-user.entity';
import { faker } from '@faker-js/faker';

interface Context {
  companyId?: number;
  firstName?: string;
  lastName?: string;
  geoHierarchyId?: number;
  roleId?: number;
  organizationId?: string;
  prePopulatedFields?: string[];
  imageUrl?: string;
  notificationEmail?: string;
  ssoLoginEmail?: string;
  password?: string;
  phone?: string;
  isExternal?: boolean;
  region?: string;
  timeZoneArea?: string;
  isHideWelcomeText?: boolean;
  isActive?: boolean;
  isEnabled?: boolean;
}

define(User, (faker_, context: Context) => {
  const user = new User();

  user.companyId = context?.companyId || 1;
  user.roleId = context?.roleId || 1;
  user.geoHierarchyId = context?.geoHierarchyId || 1;
  user.firstName = context?.firstName || faker.name.firstName();
  user.lastName = context?.lastName || faker.name.lastName();
  user.organizationId = context?.organizationId || faker.random.alphaNumeric(8);
  user.prePopulatedFields = context?.prePopulatedFields || ['Full Name'];
  user.imageUrl = context?.imageUrl || faker.image.avatar();
  user.ssoLoginEmail = context?.ssoLoginEmail || faker.internet.email();
  user.notificationEmail = context?.notificationEmail || faker.internet.email();
  user.password = context?.password || faker.random.alphaNumeric(8);
  user.phone = context?.phone || faker.phone.phoneNumber('+1 929 27#-####');
  user.isExternal = context?.isExternal || faker.datatype.boolean();
  user.region = context?.region || 'New York';
  user.timeZoneArea = context?.timeZoneArea || 'US/Pacific';
  user.isHideWelcomeText =
    context?.isHideWelcomeText || faker.datatype.boolean();
  user.isActive = context?.isActive || true;
  user.isEnabled = context?.isEnabled || true;

  return user;
});
