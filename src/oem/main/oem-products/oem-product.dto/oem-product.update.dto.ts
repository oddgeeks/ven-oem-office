import { OmitType } from '@nestjs/swagger';
import { OemProductDto } from './oem-product.dto';
import { IsOptional } from 'class-validator';
import { TermTypeEnum } from '../oem-product.enums/term-type.enum';
import { BillingFrequencyEnum } from '../oem-product.enums/billing-frequency.enum';
import { ProductAvailabilityEnum } from '../oem-product.enums/product-availability.enum';
import { EligibleForEnum } from '../oem-product.enums/eligible-for.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ProductUpdateDto extends OmitType(OemProductDto, [
  'productId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'customersProducts',
  'ownerUser',
  'quotesProducts',
  'productsRelationshipsSource',
  'productsRelationshipsTarget',
  'productHierarchy',
  'pricingModel',
]) {
  @IsOptional()
  productHierarchyId: number;

  @IsOptional()
  pricingModelId: number;

  @IsOptional()
  ownerUserId: number;

  @IsOptional()
  skuNumber: string;

  @IsOptional()
  productName: string;

  @IsOptional()
  term: number;

  @IsOptional()
  termType: TermTypeEnum;

  @IsOptional()
  billingFrequency: BillingFrequencyEnum;

  @IsOptional()
  productAvailability: ProductAvailabilityEnum[];

  @IsOptional()
  eligibleFor: EligibleForEnum[];

  @IsOptional()
  sameUnitPriceForAllTiers: boolean;

  @IsOptional()
  productCode: string;
}

export { ProductUpdateDto as OemProductUpdateDto };
