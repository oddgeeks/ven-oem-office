import { QuoteDto } from './oem-quote.dto';
import { OemQuoteEntity } from '../oem-quote.entity';
import { OmitType } from '@nestjs/swagger';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuoteSerializeDto extends OmitType(QuoteDto, [
  'pinCode',
] as const) {
  constructor(data: OemQuoteEntity) {
    super();
  }
  isApprovalTurn: boolean;
}

export { QuoteSerializeDto as OemQuoteSerializeDto };
