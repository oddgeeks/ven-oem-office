import { IsOptional } from 'class-validator';

import { OmitType } from '@nestjs/swagger';
import { OemQuotesUsersDto } from './oem-quotes-users.dto';
import { QuoteUserTypeEnum } from '../oem-quotes-external-users.enums/quote-user-type.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuotesUsersUpdateDto extends OmitType(OemQuotesUsersDto, [
  'quoteId',
  'externalUserId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'quote',
  'user',
  'companyId',
]) {
  @IsOptional()
  type: QuoteUserTypeEnum;
}

export { QuotesUsersUpdateDto as OemQuotesUsersUpdateDto };
