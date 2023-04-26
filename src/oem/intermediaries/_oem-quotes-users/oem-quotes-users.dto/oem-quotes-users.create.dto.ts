import { OmitType } from '@nestjs/swagger';
import { OemQuotesUsersDto } from './oem-quotes-users.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuotesUsersCreateDto extends OmitType(OemQuotesUsersDto, [
  'isEnabled',
  'createdAt',
  'updatedAt',
  'quote',
  'user',
  'companyId',
]) {}

export { QuotesUsersCreateDto as OemQuotesUsersCreateDto };
