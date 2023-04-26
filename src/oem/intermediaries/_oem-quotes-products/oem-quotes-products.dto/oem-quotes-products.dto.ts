import { PaymentTermEnum } from '../oem-quotes-products.enums/payment-term.enum';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class QuotesProductsDto {
  /**
   * The id of Product
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((obj) => !obj.bundleId || obj.productId)
  @Expose()
  productId: number;

  /**
   * The id of Bundle
   * @example 1
   */
  @ValidateIf((obj) => !obj.productId || obj.bundleId)
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  bundleId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of Quote
   * @example 1
   */
  @IsNumber()
  @IsOptional() // TODO: This should be mandatory for create and optional for update - we can add an guard to resolve that
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
   * The invoice schedule
   * @example { Test: 'test' }
   */
  @IsObject()
  @IsNotEmpty()
  @IsOptional()
  invoiceSchedule: object;

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
   * The payment term
   * @example 15 Net 15 Days
   */
  @IsEnum(PaymentTermEnum)
  paymentTerm: PaymentTermEnum;

  /**
   * The end date
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsNotEmpty()
  endDate: Date | string;

  /**
   * The start date
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsNotEmpty()
  startDate: Date | string;

  /**
   * The quantity
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;

  /**
   * Is locked
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isLocked: boolean;
}

export { QuotesProductsDto as OemQuotesProductsDto };
