import { OmitType } from '@nestjs/swagger';

import { NotificationDto } from './oem-notification.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class NotificationReplaceDto extends OmitType(NotificationDto, [
  'notificationId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'sender',
  'receiver',
  'customer',
  'quoteApprovalQueue',
  'vendoApprovalQueue',
  'quote',
  'vendo',
]) {}

export { NotificationReplaceDto as OemNotificationReplaceDto };
