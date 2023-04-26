import { OmitType } from '@nestjs/swagger';
import { OemQuoteCompanyChannel } from '../oem-quote-company-channel.entity';
import { OemQuoteCompanyChannelDto } from './oem-quote-company-channel.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuoteCompanyChannelUpdateDto extends OmitType(
  OemQuoteCompanyChannelDto,
  [
    'companyId',
    'quoteId',
    'companyChannelId',
    'isEnabled',
    'createdAt',
    'updatedAt',
    'company',
    'quote',
    'companyChannel',
  ] as const,
) {
  constructor(data: Partial<OemQuoteCompanyChannel> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { QuoteCompanyChannelUpdateDto as OemQuoteCompanyChannelUpdateDto };
