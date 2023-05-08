import { IsNotEmpty, IsNumber, Min, ValidateIf } from 'class-validator';
import { Expose } from 'class-transformer';
import { SfCustomerProductMetadataDto } from '../../../../shared/salesforce/salesforce.dto.metadata/customer-product.metadata.dto';

export class CustomersProductsDto extends SfCustomerProductMetadataDto {
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
   * The id of Customer
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  /**
   * The quantity
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;

  /**
   * The date
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsNotEmpty()
  endDate: Date | string;
  /*
  /!**
   * The uuid of Customer Product
   * @example 123e4567-e89b-12d3-a456-426614174000
   *!/
  @IsUUID()
  @IsNotEmpty()
  @MaxLength(36)
  @IsOptional()
  productUuid: string;*/

  /**
   * The customer price
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  customerPrice: number;

  /**
   * The quantity
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  netPrice: number;
}

export { CustomersProductsDto as OemCustomersProductsDto };
