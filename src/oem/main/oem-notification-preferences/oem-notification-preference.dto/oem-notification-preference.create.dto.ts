import { OmitType } from '@nestjs/swagger';

import { NotificationPreferenceDto } from './oem-notification-preference.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class NotificationPreferenceCreateDto extends OmitType(
  NotificationPreferenceDto,
  ['isEnabled', 'createdAt', 'updatedAt', 'company', 'companyId', 'user'],
) {}

export { NotificationPreferenceCreateDto as OemNotificationPreferenceCreateDto };
