import { OmitType } from '@nestjs/swagger';
import { OemQuotesUsersDto } from './oem-quotes-users.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuotesUsersReplaceDto extends OmitType(OemQuotesUsersDto, [
  'isEnabled',
  'createdAt',
  'updatedAt',
  'quote',
  'user',
  'companyId',
]) {}

export { QuotesUsersReplaceDto as OemQuotesUsersReplaceDto };
