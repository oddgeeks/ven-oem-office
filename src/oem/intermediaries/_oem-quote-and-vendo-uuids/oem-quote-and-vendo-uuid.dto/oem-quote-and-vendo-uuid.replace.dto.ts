import { OmitType } from '@nestjs/swagger';

import { OemQuoteAndVendoUuidDto } from './oem-quote-and-vendo-uuid.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuoteAndVendoUuidReplaceDto extends OmitType(
  OemQuoteAndVendoUuidDto,
  ['isEnabled', 'createdAt', 'updatedAt', 'company'],
) {}

export { QuoteAndVendoUuidReplaceDto as OemQuoteAndVendoUuidReplaceDto };
