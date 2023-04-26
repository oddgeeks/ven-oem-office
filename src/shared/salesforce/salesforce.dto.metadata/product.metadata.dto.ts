import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SfProductMetadataDto {
  /**
   * @example product-1234
   */
  @IsString()
  @MaxLength(64)
  @IsOptional()
  productCode: string;

  /**
   * The Salesforce product id
   * Used in Salesforce
   * @example 0065f00000995z2AAA
   */
  @IsOptional()
  sfProductId: string | null;

  /**
   * The Salesforce price book ID (set in the admin panel/salesforce integration object)
   * Used in Salesforce
   * @example 0065f00000995z2AAA
   */
  @IsOptional()
  sfPriceBookId: string | null;

  /**
   * The Vendori 'display' URL of the product
   * Used in Salesforce
   * @example https://staging.vendori.com/products/4
   */
  @IsOptional()
  displayUrl: string | null;

  /**
   * The last user to modify the product
   * Used in Salesforce
   * @example 24
   */
  @IsOptional()
  lastModifierUserId: number | null;

  /**
   * The Description of the product
   * Used in Salesforce
   * @example Model details ...
   */
  @IsOptional()
  productDescription: string | null;
}
