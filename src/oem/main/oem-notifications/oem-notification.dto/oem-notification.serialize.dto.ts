import { PartialType } from '@nestjs/swagger';

import { NotificationDto } from './oem-notification.dto';
import { OemNotification } from '../oem-notification.entity';

export class NotificationSerializeDto extends PartialType(NotificationDto) {
  constructor(data: Partial<OemNotification> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { NotificationSerializeDto as OemNotificationSerializeDto };
