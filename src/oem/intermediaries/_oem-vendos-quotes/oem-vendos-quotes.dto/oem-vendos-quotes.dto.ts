import { IsNotEmpty, IsNumber, IsObject, IsOptional } from 'class-validator';

export class VendosQuotesDto {
  /**
   * The id of Vendo
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  vendoId: number;
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
}

export { VendosQuotesDto as OemVendosQuotesDto };
