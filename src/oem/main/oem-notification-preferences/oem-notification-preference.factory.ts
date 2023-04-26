import { define } from 'typeorm-seeding';

import { OemNotificationPreference } from './oem-notification-preference.entity';

interface Context {
  companyId: number;
  userId?: number;
}

define(OemNotificationPreference, (faker_, context: Context) => {
  const notificationPreference = new OemNotificationPreference();

  notificationPreference.companyId = context?.companyId || 1;
  notificationPreference.userId = context?.userId || 1;

  return notificationPreference;
});
