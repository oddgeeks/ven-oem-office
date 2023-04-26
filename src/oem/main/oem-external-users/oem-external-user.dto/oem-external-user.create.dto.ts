import { OmitType } from '@nestjs/swagger';

import { ExternalUser } from '../oem-external-user.entity';
import { OemExternalUserDto } from './oem-external-user.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ExternalUserCreateDto extends OmitType(OemExternalUserDto, [
  'externalUserId',
  'companyId',
  'createdAt',
  'updatedAt',
  'isEnabled',
] as const) {
  constructor(data: Partial<ExternalUser> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { ExternalUserCreateDto as OemExternalUserCreateDto };
