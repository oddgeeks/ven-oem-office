import { OmitType } from '@nestjs/swagger';

import { OemVendosUsersDto } from './oem-vendos-users.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class VendosUsersUpdateDto extends OmitType(OemVendosUsersDto, [
  'vendoId',
  'userId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'vendo',
  'user',
  'companyId',
]) {}

export { VendosUsersUpdateDto as OemVendosUsersUpdateDto };
