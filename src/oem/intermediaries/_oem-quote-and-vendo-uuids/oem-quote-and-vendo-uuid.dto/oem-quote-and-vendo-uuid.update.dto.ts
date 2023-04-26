import { OmitType } from '@nestjs/swagger';

import { OemQuoteAndVendoUuidDto } from './oem-quote-and-vendo-uuid.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuoteAndVendoUuidUpdateDto extends OmitType(
  OemQuoteAndVendoUuidDto,
  [
    'quoteAndVendoUuidType',
    'companyId',
    'isEnabled',
    'createdAt',
    'updatedAt',
    'company',
  ],
) {}

export { QuoteAndVendoUuidUpdateDto as OemQuoteAndVendoUuidUpdateDto };
