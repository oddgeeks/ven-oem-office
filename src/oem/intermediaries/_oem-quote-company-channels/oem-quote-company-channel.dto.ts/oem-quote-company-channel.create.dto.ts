import { OmitType } from '@nestjs/swagger';
import { OemQuoteCompanyChannelDto } from './oem-quote-company-channel.dto';
import { OemQuoteCompanyChannel } from '../oem-quote-company-channel.entity';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuoteCompanyChannelCreateDto extends OmitType(
  OemQuoteCompanyChannelDto,
  [
    'companyId',
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

export { QuoteCompanyChannelCreateDto as OemQuoteCompanyChannelCreateDto };
