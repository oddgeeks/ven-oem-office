import { OemNotificationPreferenceCreateDto } from './oem-notification-preference.create.dto';
import { OemNotificationPreferenceUpdateDto } from './oem-notification-preference.update.dto';
import { OemNotificationPreferenceReplaceDto } from './oem-notification-preference.replace.dto';
import { OemNotificationPreferenceSerializeDto } from './oem-notification-preference.serialize.dto';

export const dto = {
  create: OemNotificationPreferenceCreateDto,
  update: OemNotificationPreferenceUpdateDto,
  replace: OemNotificationPreferenceReplaceDto,
};

export const serialize = {
  get: OemNotificationPreferenceSerializeDto,
  many: OemNotificationPreferenceSerializeDto,
};
