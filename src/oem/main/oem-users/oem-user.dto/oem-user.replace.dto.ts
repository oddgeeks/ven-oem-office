import { OmitType } from '@nestjs/swagger';
import { OemUserDto } from './oem-user.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class UserReplaceDto extends OmitType(OemUserDto, [
  'userId',
  'companyId',
  'createdAt',
  'updatedAt',
  'isEnabled',
  'role',
  'companyChannel',
  'password',
] as const) {}

export { UserReplaceDto as OemUserReplaceDto };
