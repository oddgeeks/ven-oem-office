import { OmitType } from '@nestjs/swagger';
import { Validate } from 'class-validator';

import { QuoteDto } from './oem-quote.dto';
import { User } from '../../oem-users/oem-user.entity';
import { StatusUpdateValidator } from '../oem-quote.validators/status-update.validator';
import { QuoteStatusEnum } from '../oem-quote.enums/quote-status.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuoteCreateDto extends OmitType(QuoteDto, [
  'quoteId',
  'submittedAt',
  'daysSinceSubmission',
  'companyId',
  'pinCode',
  'isEnabled',
  'updatedAt',
  'createdAt',
] as const) {
  constructor(data: Partial<User> = {}) {
    super();
    Object.assign(this, data);
  }

  @Validate(StatusUpdateValidator)
  quoteStatus: QuoteStatusEnum;
}

export { QuoteCreateDto as OemQuoteCreateDto };
