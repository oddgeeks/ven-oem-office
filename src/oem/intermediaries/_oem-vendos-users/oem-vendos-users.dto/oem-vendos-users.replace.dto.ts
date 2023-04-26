import { OmitType } from '@nestjs/swagger';
import { OemVendosUsersDto } from './oem-vendos-users.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class VendosUsersReplaceDto extends OmitType(OemVendosUsersDto, [
  'isEnabled',
  'createdAt',
  'updatedAt',
  'vendo',
  'user',
  'companyId',
]) {}

export { VendosUsersReplaceDto as OemVendosUsersReplaceDto };
