import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  IsBoolean,
} from 'class-validator';
import { QuoteUserTypeEnum } from '../../_oem-quotes-users/oem-quotes-users.enums/quoteUserTypeEnum';

export class QuotesContactsDto {
  /**
   * The id of Quote
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  quoteId: number;

  /**
   * The id of Contact
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  contactId: number;

  /**
   * The type
   * @example End Customer
   */
  @IsEnum(QuoteUserTypeEnum)
  type: QuoteUserTypeEnum;

  /**
   * The position
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  position: number;

  /**
   * Is owner
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  isOwner: boolean;
}

export { QuotesContactsDto as OemQuotesContactsDto };
