import { PaymentTermEnum } from '../oem-quotes-customer-products.enums/payment-term.enum';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class QuotesCustomerProductsDto {
  /**
   * The id of Product
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  customerProductId: number;

  /**
   * The id of Quote
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  quoteId: number;

  /**
   * The locked fields
   * @example { Test: 'test' }
   */
  @IsObject()
  @IsNotEmpty()
  @IsOptional()
  lockedFields: object;

  /**
   * The uuid of Quote Product
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  @IsUUID()
  @IsNotEmpty()
  @MaxLength(36)
  @IsOptional()
  customerProductUuid: string;

  /**
   * Is locked
   * @example true
   */
  @IsBoolean()
  isLocked: boolean;

  /*/!**
   * Is enabled
   * @example true
   *!/
  @IsBoolean()
  @IsOptional()
  isEnabled: boolean;*/
}

export { QuotesCustomerProductsDto as OemQuotesCustomerProductsDto };
