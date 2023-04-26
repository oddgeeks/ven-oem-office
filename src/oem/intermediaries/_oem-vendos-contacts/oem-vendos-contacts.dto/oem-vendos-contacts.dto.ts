import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  Max,
  Min,
} from 'class-validator';
import { QuoteUserTypeEnum } from '../../_oem-quotes-users/oem-quotes-users.enums/quoteUserTypeEnum';

export class VendosContactsDto {
  /**
   * The id of Vendo
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  vendoId: number;

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

export { VendosContactsDto as OemVendosContactsDto };
