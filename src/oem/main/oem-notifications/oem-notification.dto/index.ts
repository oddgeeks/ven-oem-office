import { OemNotificationCreateDto } from './oem-notification.create.dto';
import { OemNotificationReplaceDto } from './oem-notification.replace.dto';
import { OemNotificationUpdateDto } from './oem-notification.update.dto';
import { OemNotificationSerializeDto } from './oem-notification.serialize.dto';

export const dto = {
  create: OemNotificationCreateDto,
  update: OemNotificationUpdateDto,
  replace: OemNotificationReplaceDto,
};

export const serialize = {
  get: OemNotificationSerializeDto,
  many: OemNotificationSerializeDto,
};
