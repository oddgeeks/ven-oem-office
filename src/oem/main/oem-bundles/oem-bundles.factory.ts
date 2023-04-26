import { define } from 'typeorm-seeding';

import { OemProductEntity } from '../oem-products/oem-product.entity';
import { BillingFrequencyEnum } from '../oem-products/oem-product.enums/billing-frequency.enum';
import { ProductAvailabilityEnum } from '../oem-products/oem-product.enums/product-availability.enum';
import { EligibleForEnum } from '../oem-products/oem-product.enums/eligible-for.enum';
import { BundleName, OemBundleEntity } from './oem-bundle.entity';

const productNameExamples: Array<BundleName> = [
  'OEM Bundle 1' as BundleName,
  'OEM Bundle 2' as BundleName,
  'OEM Bundle 3' as BundleName,
  'OEM Bundle 4' as BundleName,
  'OEM Bundle 5' as BundleName,
  'OEM Bundle 6' as BundleName,
  'OEM Bundle 7' as BundleName,
];

interface Context {
  companyId?: number;
  productHierarchyId?: number;
  ownerUserId?: number;
  skuNumber?: string;
  productName?: string;
  billingFrequency?: BillingFrequencyEnum;
  productAvailability?: Array<ProductAvailabilityEnum>;
  products?: Array<OemProductEntity>;
  eligibleFor?: Array<EligibleForEnum>;
  isEnabled?: boolean;
}

define(OemBundleEntity, (faker_, context: Context) => {
  const bundle = new OemBundleEntity();

  const PRODUCT_AVAILABILITY = Object.keys(ProductAvailabilityEnum);
  bundle.companyId = context?.companyId || 1;
  bundle.productHierarchyId = context?.productHierarchyId || 100;
  bundle.ownerUserId = context?.ownerUserId || 1;
  bundle.skuNumber = context?.skuNumber || 'SKU-1';
  bundle['bundleName'] =
    (context?.productName as BundleName) ||
    productNameExamples[Math.floor(Math.random() * productNameExamples.length)];
  //this is super trick to use typeorm seed factory
  //bundle.productName = bundle['bundleName'];
  bundle.productAvailability = (context?.productAvailability &&
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
  ];
  bundle.eligibleFor = context?.eligibleFor || [EligibleForEnum.EXTENSION];
  bundle.products = context?.products || [];
  bundle.isEnabled = context?.isEnabled || true;

  return bundle;
});
