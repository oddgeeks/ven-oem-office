import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

import { OemChannelEntity } from './oem-channel.entity';

interface Context {
  channelId?: number;
  logoUrl?: string;
  name?: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive?: boolean;
  isEnabled?: boolean;
}

define(OemChannelEntity, (faker_, context: Context) => {
  const channel = new OemChannelEntity();

  channel.channelId = context?.channelId || 1;
  channel.logoUrl = context?.logoUrl || faker.image.imageUrl();
  channel.name = context?.name || "Bob's Partner";
  channel.website = context?.website || faker.internet.url();
  channel.contactName = context?.contactName || faker.name.firstName();
  channel.contactEmail = context?.contactEmail || faker.internet.email();
  channel.contactPhone = context?.contactPhone || faker.phone.phoneNumber();
  channel.isActive = context?.isActive || true;
  channel.isEnabled = context?.isEnabled || true;

  return channel;
});
