import { MaxLength, MinLength } from 'class-validator';
import { PIN_CODE_LENGTH } from '../oem-quote.entity';

export class QuotePinCodeDto {
  /**
   * The pin code
   * @example 1GHJ67
   */
  @MaxLength(PIN_CODE_LENGTH)
  @MinLength(PIN_CODE_LENGTH)
  pinCode: string;
}

/**
 * make more clear for swagger DTO (without OEM prefix)
 * we remove oem prefix form class name due keeping DTO clear in docs, but provided as Oem for keeping context
 */
export { QuotePinCodeDto as OemQuotePinCodeDto };
