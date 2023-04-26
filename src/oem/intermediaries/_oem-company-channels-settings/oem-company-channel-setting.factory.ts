import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

import { OemCompanyChannelSetting } from './oem-company-channel-setting.entity';

interface Context {
  channelId: number;
  logoUrl?: string;
  name?: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  companyId: number;
  isActive?: boolean;
  isEnabled?: boolean;
}

define(OemCompanyChannelSetting, (faker_, context: Context) => {
  const channel = new OemCompanyChannelSetting();

  channel.channelId = context?.channelId || 1;
  channel.logoUrl = context?.logoUrl || faker.image.imageUrl();
  channel.name = context?.name || "Bob's Partner";
  channel.companyId = context?.companyId || 1;
  channel.website = context?.website || faker.internet.url();
  channel.contactName = context?.contactName || faker.name.firstName();
  channel.contactEmail = context?.contactEmail || faker.internet.email();
  channel.contactPhone = context?.contactPhone || faker.phone.phoneNumber();
  channel.isEnabled = context?.isEnabled || true;

  return channel;
});
