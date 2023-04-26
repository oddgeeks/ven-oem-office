import { OemProductEntity } from '../../oem-products/oem-product.entity';
import {
  CustomersProducts,
  OemCustomersProducts,
} from '../../../intermediaries/_oem-customers-products/oem-customers-products.entity';
import {
  OemProductsRelationships, ProductsRelationships,
} from '../../../intermediaries/_oem-products-relationships/oem-products-relationships.entity';
import { OemHierarchyEntity } from '../../oem-hierarchies/oem-hierarchy.entity';
import { OemPricingModelEntity} from '../../oem-pricing-models/oem-pricing-model.entity';
import { ProductAvailabilityEnum } from '../../oem-products/oem-product.enums/product-availability.enum';
import { OemUserEntity, User } from '../../oem-users/oem-user.entity';
import { MetadataDto } from '../../../../common/dtos/metadata.dto';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber, IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { IsProductHierarchy } from '../../oem-hierarchies/oem-hierarchy.validators/oem-hierarchy.validators';
import { ApiProperty } from '@nestjs/swagger';
import { EligibleForEnum } from '../../oem-products/oem-product.enums/eligible-for.enum';
import { Expose, Type } from 'class-transformer';
import { BundleId, OemBundleEntity } from '../oem-bundle.entity';
import { OemQuotesProducts } from '../../../intermediaries/_oem-quotes-products/oem-quotes-products.entity';

export class BundleDto extends MetadataDto /*implements OemBundleEntity*/ {
  /**
   * The id of Product which represents Bundle
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  //@Expose({ name: 'bundleId' })
  bundleId: BundleId;

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
   * @example SKU-1
   */
  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  skuNumber: string;

  /**
   * The name of Bundle, but in system it represents like product
   * @example Product-1
   */
  @IsString()
  @MaxLength(128)
  @IsNotEmpty()
  @Expose({ name: 'bundleName' })
  bundleName: string & { __brand: 'bundleName' };

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
   * The customer bundles
   * @example Customer Product
   */
  @IsArray()
  @Type(() => OemCustomersProducts)
  customersProducts: OemCustomersProducts[];

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
  @Type(() => OemQuotesProducts)
  quotesBundles: OemQuotesProducts[];

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
   * The producs
   * @example ProductEntity
   */
  @IsArray()
  @Type(() => OemProductEntity)
  products: OemProductEntity[];
  /**
   * The bundle settings. It uses to set custom values / metadata to bundle/products.
   * @example [{ productId: 1, defaultQuantity: 1, is_editable: true }]
   */
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  bundleSettings: Array<object>;
  customersBundles: CustomersProducts[];
  productsRelationshipsSources: ProductsRelationships[];
  productsRelationshipsTargets: ProductsRelationships[];
}

export { BundleDto as OemBundleDto };
