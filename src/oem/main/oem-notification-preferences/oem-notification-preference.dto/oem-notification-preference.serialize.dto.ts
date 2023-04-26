import { PartialType } from '@nestjs/swagger';

import { NotificationPreferenceDto } from './oem-notification-preference.dto';
import { OemNotificationPreference } from '../oem-notification-preference.entity';

export class NotificationPreferenceSerializeDto extends PartialType(
  NotificationPreferenceDto,
) {
  constructor(data: Partial<OemNotificationPreference> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { NotificationPreferenceSerializeDto as OemNotificationPreferenceSerializeDto };
