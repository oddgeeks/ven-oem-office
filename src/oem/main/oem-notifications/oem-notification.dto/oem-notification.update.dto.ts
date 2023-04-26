import { PickType } from '@nestjs/swagger';

import { NotificationDto } from './oem-notification.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class NotificationUpdateDto extends PickType(NotificationDto, [
  'isRead',
]) {}

export { NotificationUpdateDto as OemNotificationUpdateDto };
