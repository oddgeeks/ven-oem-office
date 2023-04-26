import { PartialType } from '@nestjs/swagger';

import { OemQuoteCompanyChannelDto } from './oem-quote-company-channel.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuoteCompanyChannelSerializelDto extends PartialType(
  OemQuoteCompanyChannelDto,
) {}

export { QuoteCompanyChannelSerializelDto as OemQuoteCompanyChannelSerializelDto };
