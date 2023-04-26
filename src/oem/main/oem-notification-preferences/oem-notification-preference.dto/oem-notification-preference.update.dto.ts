import { OmitType } from '@nestjs/swagger';

import { NotificationPreferenceDto } from './oem-notification-preference.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class NotificationPreferenceUpdateDto extends OmitType(
  NotificationPreferenceDto,
  [
    'companyId',
    'userId',
    'isEnabled',
    'createdAt',
    'updatedAt',
    'company',
    'user',
  ],
) {}

export { NotificationPreferenceUpdateDto as OemNotificationPreferenceUpdateDto };
