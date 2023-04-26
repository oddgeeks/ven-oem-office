import { OmitType } from '@nestjs/swagger';
import { OemVendosUsersDto } from './oem-vendos-users.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class VendosUsersCreateDto extends OmitType(OemVendosUsersDto, [
  'isEnabled',
  'createdAt',
  'updatedAt',
  'vendo',
  'user',
  'companyId',
]) {}

export { VendosUsersCreateDto as OemVendosUsersCreateDto };
