import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemProductEntity } from '../../main/oem-products/oem-product.entity';
import { TermTypeEnum } from '../../main/oem-products/oem-product.enums/term-type.enum';
import { BillingFrequencyEnum } from '../../main/oem-products/oem-product.enums/billing-frequency.enum';
import { ProductAvailabilityEnum } from '../../main/oem-products/oem-product.enums/product-availability.enum';
import { seedEntities } from '../../../utils/seed-factory.util';
import { EligibleForEnum } from '../../main/oem-products/oem-product.enums/eligible-for.enum';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemProducts implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const products: Partial<OemProductEntity>[] = [
        {
          ownerUserId: 2,
          pricingModelId: 4,
          skuNumber: '123456',
          productName: 'Quicken',
          term: 3,
          termType: TermTypeEnum.YEARS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.MONTHLY,
          productAvailability: [ProductAvailabilityEnum.CURRENT_PRODUCT],
          eligibleFor: [
            EligibleForEnum.EXPANSION,
            EligibleForEnum.EXTENSION,
            EligibleForEnum.CANCELLATION_TERMINATION,
          ],
          isEnabled: false,
          companyId,
        },
        {
          ownerUserId: 2,
          pricingModelId: 2,
          skuNumber: 'SKU-1',
          productName: 'Product A (tiered)',
          term: 3,
          termType: TermTypeEnum.YEARS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.WEEKLY,
          productAvailability: [ProductAvailabilityEnum.CURRENT_PRODUCT],
          eligibleFor: [EligibleForEnum.EXPANSION, EligibleForEnum.EXTENSION],
          isEnabled: false,
          companyId,
        },
        {
          ownerUserId: 2,
          pricingModelId: 3,
          skuNumber: '232',
          productName: 'test 2',
          term: 1,
          termType: TermTypeEnum.MONTHS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.MONTHLY,
          productAvailability: [ProductAvailabilityEnum.RETIRED_PRODUCT],
          eligibleFor: [],
          isEnabled: false,
          companyId,
        },
        {
          ownerUserId: 2,
          pricingModelId: 2,
          skuNumber: '232',
          productName: 'test billing',
          term: 1,
          termType: TermTypeEnum.YEARS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.WEEKLY,
          productAvailability: [
            ProductAvailabilityEnum.ADD_ON_UPGRADE_DOWNGRADE,
          ],
          eligibleFor: [
            EligibleForEnum.EXPANSION,
            EligibleForEnum.EXTENSION,
            EligibleForEnum.CANCELLATION_TERMINATION,
          ],
          isEnabled: false,
          companyId,
        },
        {
          ownerUserId: 2,
          pricingModelId: 2,
          skuNumber: '123',
          productName: 'test 3',
          term: 5,
          termType: TermTypeEnum.MONTHS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.MONTHLY,
          productAvailability: [ProductAvailabilityEnum.CURRENT_PRODUCT],
          eligibleFor: [EligibleForEnum.EXTENSION],
          isEnabled: false,
          companyId,
        },
        {
          ownerUserId: 2,
          pricingModelId: 5,
          skuNumber: '1',
          productName: 'Standard Finance Software',
          term: 3,
          termType: TermTypeEnum.YEARS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.ANNUALLY,
          productAvailability: [ProductAvailabilityEnum.CURRENT_PRODUCT],
          eligibleFor: [EligibleForEnum.EXPANSION, EligibleForEnum.EXTENSION],
          isEnabled: true,
          companyId,
        },
        {
          ownerUserId: 2,
          pricingModelId: 7,
          skuNumber: '5',
          productName: 'Services Package',
          term: 1,
          termType: TermTypeEnum.YEARS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.UPFRONT,
          productAvailability: [ProductAvailabilityEnum.CURRENT_PRODUCT],
          eligibleFor: [],
          isEnabled: true,
          companyId,
        },
        {
          ownerUserId: 2,
          pricingModelId: 6,
          skuNumber: '3',
          productName: '25" Monitor',
          term: 1,
          termType: TermTypeEnum.YEARS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.UPFRONT,
          productAvailability: [ProductAvailabilityEnum.CURRENT_PRODUCT],
          eligibleFor: [EligibleForEnum.EXTENSION],
          isEnabled: true,
          companyId,
        },
        {
          ownerUserId: 2,
          pricingModelId: 6,
          skuNumber: '4',
          productName: '36" Monitor',
          term: 1,
          termType: TermTypeEnum.YEARS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.UPFRONT,
          productAvailability: [ProductAvailabilityEnum.CURRENT_PRODUCT],
          eligibleFor: [],
          isEnabled: true,
          companyId,
        },
        {
          ownerUserId: 2,
          pricingModelId: 5,
          skuNumber: '2',
          productName: 'Premium Finance Software',
          term: 3,
          termType: TermTypeEnum.YEARS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.ANNUALLY,
          productAvailability: [ProductAvailabilityEnum.CURRENT_PRODUCT],
          eligibleFor: [EligibleForEnum.EXPANSION, EligibleForEnum.EXTENSION],
          isEnabled: true,
          companyId,
        },
        {
          ownerUserId: 2,
          pricingModelId: 8,
          skuNumber: '6',
          productName: 'Services Hourly',
          term: 6,
          termType: TermTypeEnum.MONTHS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.MONTHLY,
          productAvailability: [ProductAvailabilityEnum.CURRENT_PRODUCT],
          eligibleFor: [],
          isEnabled: true,
          companyId,
        },
        {
          ownerUserId: 2,
          pricingModelId: 6,
          skuNumber: '8',
          productName: 'High Capacity Server',
          term: 1,
          termType: TermTypeEnum.YEARS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.UPFRONT,
          productAvailability: [ProductAvailabilityEnum.CURRENT_PRODUCT],
          eligibleFor: [],
          isEnabled: true,
          companyId,
        },
        {
          ownerUserId: 2,
          pricingModelId: 6,
          skuNumber: '9',
          productName: 'Low Capacity Server',
          term: 1,
          termType: TermTypeEnum.YEARS,
          sameUnitPriceForAllTiers: true,
          billingFrequency: BillingFrequencyEnum.UPFRONT,
          productAvailability: [ProductAvailabilityEnum.CURRENT_PRODUCT],
          eligibleFor: [EligibleForEnum.EXTENSION],
          isEnabled: true,
          companyId,
        },
      ];

      const productEntities = await seedEntities(
        connection,
        OemProductEntity,
        products,
      );

      return productEntities;
    }
  };
