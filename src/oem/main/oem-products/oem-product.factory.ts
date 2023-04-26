import { define } from 'typeorm-seeding';

import { Product, ProductName } from './oem-product.entity';
import { TermTypeEnum } from './oem-product.enums/term-type.enum';
import { BillingFrequencyEnum } from './oem-product.enums/billing-frequency.enum';
import { ProductAvailabilityEnum } from './oem-product.enums/product-availability.enum';
import {
  CustomBillingFrequencySettings,
  CustomBillingFrequencySettingsType,
} from './oem-product.types/custom-billing-frequency-settings.type';
import { EligibleForEnum } from './oem-product.enums/eligible-for.enum';

const productNameExamples: Array<ProductName> = [
  'OEM Product 1' as ProductName,
  'OEM Product 2' as ProductName,
  'OEM Product 3' as ProductName,
  'OEM Product 4' as ProductName,
  'OEM Product 5' as ProductName,
  'OEM Product 6' as ProductName,
  'OEM Product 7' as ProductName,
];

interface Context {
  companyId?: number;
  productHierarchyId?: number;
  pricingModelId?: number;
  ownerUserId?: number;
  skuNumber?: string;
  productName?: ProductName;
  term?: number;
  termType?: TermTypeEnum;
  billingFrequency?: BillingFrequencyEnum;
  productAvailability?: Array<ProductAvailabilityEnum>;
  customBillingFrequencySettings?: CustomBillingFrequencySettingsType;
  sameUnitPriceForAllTiers?: boolean;
  eligibleFor?: Array<EligibleForEnum>;
  isEnabled?: boolean;
}

define(Product, (faker_, context: Context) => {
  const product = new Product();

  const PRODUCT_AVAILABILITY = Object.keys(ProductAvailabilityEnum);
  product.companyId = context?.companyId || 1;
  product.productHierarchyId = context?.productHierarchyId || 100;
  product.pricingModelId = context?.pricingModelId || 1;
  product.ownerUserId = context?.ownerUserId || 1;
  product.skuNumber = context?.skuNumber || 'SKU-1';
  product.productName =
    context?.productName ||
    productNameExamples[Math.floor(Math.random() * productNameExamples.length)];
  product.term = context?.term || 10;
  product.termType = context?.termType || TermTypeEnum.DAYS;
  product.billingFrequency =
    context?.billingFrequency || BillingFrequencyEnum.MONTHLY;
  product.productAvailability = [
    ProductAvailabilityEnum.CURRENT_PRODUCT,
    ProductAvailabilityEnum.RETIRED_PRODUCT,
  ];
  /* (context?.productAvailability &&
   ((Array.isArray(context?.productAvailability) &&
     context?.productAvailability) || [context?.productAvailability])) || [
   ProductAvailabilityEnum[
     PRODUCT_AVAILABILITY[
       Math.floor(Math.random() * PRODUCT_AVAILABILITY.length)
     ]
   ],
   ProductAvailabilityEnum[
     PRODUCT_AVAILABILITY[
       Math.floor(Math.random() * PRODUCT_AVAILABILITY.length)
     ]
   ],
 ];*/
  product.customBillingFrequencySettings =
    context?.customBillingFrequencySettings ||
    new CustomBillingFrequencySettings({
      period: {
        term: 1,
        type: TermTypeEnum.MONTHS,
      },
      frequency: 1,
    });
  product.sameUnitPriceForAllTiers = context?.sameUnitPriceForAllTiers || true;
  product.eligibleFor = context?.eligibleFor || [EligibleForEnum.EXTENSION];
  product.isEnabled = context?.isEnabled || true;

  return product;
});
