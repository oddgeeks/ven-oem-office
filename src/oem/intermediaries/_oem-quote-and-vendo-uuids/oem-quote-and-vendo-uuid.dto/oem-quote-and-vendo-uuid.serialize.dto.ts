import { PartialType } from '@nestjs/swagger';
import { OemQuoteAndVendoUuidDto } from './oem-quote-and-vendo-uuid.dto';
import { QuoteAndVendoUuid } from '../oem-quote-and-vendo-uuid.entity';

export class QuoteAndVendoUuidSerializeDto extends PartialType(
  OemQuoteAndVendoUuidDto,
) {
  constructor(data: Partial<QuoteAndVendoUuid> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { QuoteAndVendoUuidSerializeDto as OemQuoteAndVendoUuidSerializeDto };
