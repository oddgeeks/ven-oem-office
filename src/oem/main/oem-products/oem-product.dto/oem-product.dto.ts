import { TermTypeEnum } from '../oem-product.enums/term-type.enum';
import { BillingFrequencyEnum } from '../oem-product.enums/billing-frequency.enum';
import { ProductAvailabilityEnum } from '../oem-product.enums/product-availability.enum';
import { OemCustomersProducts } from '../../../intermediaries/_oem-customers-products/oem-customers-products.entity';
import { OemUserEntity } from '../../oem-users/oem-user.entity';
import { OemQuotesCustomerProducts } from '../../../intermediaries/_oem-quotes-customer-products/oem-quotes-customer-products.entity';
import { OemProductsRelationships } from '../../../intermediaries/_oem-products-relationships/oem-products-relationships.entity';
import { OemHierarchyEntity } from '../../oem-hierarchies/oem-hierarchy.entity';
import { OemPricingModelEntity } from '../../oem-pricing-models/oem-pricing-model.entity';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsProductHierarchy } from '../../oem-hierarchies/oem-hierarchy.validators/oem-hierarchy.validators';
import {
  CustomBillingFrequencySettings,
  CustomBillingFrequencySettingsType,
} from '../oem-product.types/custom-billing-frequency-settings.type';
import { ApiProperty } from '@nestjs/swagger';
import { EligibleForEnum } from '../oem-product.enums/eligible-for.enum';

export class ProductDto {
  /**
   * The id of Product
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  /**
   * The id of Product Hierarchy
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Validate(IsProductHierarchy)
  productHierarchyId: number;

  /**
   * The id of the Owner
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  ownerUserId: number;

  /**
   * The id of Pricing Model
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  pricingModelId: number;

  /**
   * The id of Pricing Model
   * @example SKU-1
   */
  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  skuNumber: string;

  /**
   * The name of Product
   * @example Product-1
   */
  @IsString()
  @MaxLength(128)
  @IsNotEmpty()
  productName: string;

  /**
   * The term number based on termType
   * @example 10
   */
  @IsNumber()
  @IsNotEmpty()
  term: number;

  /**
   * The term type
   * @example days
   */
  @IsEnum(TermTypeEnum)
  @IsNotEmpty()
  termType: TermTypeEnum;

  /**
   * The billing frequency
   * @example Every 30 Days
   */
  @IsEnum(BillingFrequencyEnum)
  @IsNotEmpty()
  billingFrequency: BillingFrequencyEnum;

  @ApiProperty({
    description: 'The product availability',
    isArray: true,
    enum: ProductAvailabilityEnum,
  })
  @IsEnum(ProductAvailabilityEnum, { each: true })
  @IsNotEmpty()
  productAvailability: ProductAvailabilityEnum[];

  @ApiProperty({
    description: 'Eligible for',
    isArray: true,
    enum: EligibleForEnum,
  })
  @IsEnum(EligibleForEnum, { each: true })
  @IsNotEmpty()
  eligibleFor: EligibleForEnum[];

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  isEnabled: boolean;

  /**
   * Is the same unit price
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  sameUnitPriceForAllTiers: boolean;

  /**
   * The date of creating product.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of updating product.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;

  /**
   * The customBillingFrequencySettings
   * @example {period: {term: 1, type: 'Month'}, frequency: 2}
   */
  @IsOptional()
  @Type(() => CustomBillingFrequencySettings)
  customBillingFrequencySettings: CustomBillingFrequencySettingsType;

  /**
   * The customer products
   * @example Customer Product
   */
  @IsArray()
  @Type(() => OemCustomersProducts)
  customersProducts: OemCustomersProducts[];

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

  /**
   * The the Owner
   * @example User
   */
  @Type(() => OemUserEntity)
  ownerUser: OemUserEntity;

  /**
   * The customer products
   * @example Quotes Products
   */
  @IsArray()
  @Type(() => OemQuotesCustomerProducts)
  quotesProducts: OemQuotesCustomerProducts[];

  /**
   * The product relationship
   * @example ProductsRelationshipsSource
   */
  @IsArray()
  @Type(() => OemProductsRelationships)
  productsRelationshipsSource: OemProductsRelationships[];

  /**
   * The product relationship
   * @example ProductsRelationshipsTarget
   */
  @IsArray()
  @Type(() => OemProductsRelationships)
  productsRelationshipsTarget: OemProductsRelationships[];

  /**
   * The product hierarchy
   * @example HierarchyEntity
   */
  @Type(() => OemHierarchyEntity)
  productHierarchy: OemHierarchyEntity;

  /**
   * The pricing model
   * @example PricingModelEntity
   */
  @Type(() => OemPricingModelEntity)
  pricingModel: OemPricingModelEntity;
}

export { ProductDto as OemProductDto };
