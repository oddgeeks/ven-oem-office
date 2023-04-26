import { OmitType } from '@nestjs/swagger';
import { OemBundleDto } from './oem-bundle.dto';
import { IsOptional } from 'class-validator';
import { TermTypeEnum } from '../../oem-products/oem-product.enums/term-type.enum';
import { BillingFrequencyEnum } from '../../oem-products/oem-product.enums/billing-frequency.enum';
import { ProductAvailabilityEnum } from '../../oem-products/oem-product.enums/product-availability.enum';
import { EligibleForEnum } from '../../oem-products/oem-product.enums/eligible-for.enum';
import { OemProductEntity } from '../../oem-products/oem-product.entity';

class BundleUpdateDto extends OmitType(OemBundleDto, [
  'bundleId',
  'companyId',
  'customersProducts',
  'quotesBundles',
  'ownerUser',
  'productsRelationshipsSource',
  'productsRelationshipsTarget',
  'createdAt',
  'updatedAt',
  'isEnabled',
] as const) {
  @IsOptional()
  products: OemProductEntity[];

  @IsOptional()
  bundleSettings: Array<object>;

  @IsOptional()
  productHierarchyId: number;

  @IsOptional()
  pricingModelId: number;

  @IsOptional()
  bundleName: string & { __brand: 'bundleName' };

  @IsOptional()
  ownerUserId: number;

  @IsOptional()
  skuNumber: string;

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
}

export { BundleUpdateDto as OemBundleUpdateDto };
