import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemQuotesCustomerProducts } from '../../intermediaries/_oem-quotes-customer-products/oem-quotes-customer-products.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemQuoteCustomerProducts implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const quoteCustomerProducts: Partial<OemQuotesCustomerProducts>[] = [
        {
          customerProductId: 5,
          quoteId: 9,
          customerProductUuid: '7823e325-4434-4c0a-8755-2e1d3b84fb25',
          lockedFields: {
            days: 1,
            weeks: 0,
            years: 0.0026881720430107525,
            months: 0.03225806451612903,
            endDate: '2023-02-01T00:00:00.000Z',
            product: {
              term: 1,
              addons: [
                {
                  isActive: true,
                  companyId,
                  createdAt: '2023-01-14T14:59:36.697Z',
                  isEnabled: true,
                  updatedAt: '2023-01-14T14:59:36.697Z',
                  eligibleType: 'Addon',
                  listPriceType: 'Full List Price',
                  targetProduct: {
                    term: 1,
                    termType: 'years',
                    companyId,
                    createdAt: '2023-01-17T03:48:04.277Z',
                    isEnabled: true,
                    productId: 9,
                    skuNumber: '04',
                    updatedAt: '2023-01-17T03:48:04.277Z',
                    isRenewable: false,
                    ownerUserId: 2,
                    productName: '36" Monitor',
                    isExpandable: false,
                    isUpgradable: false,
                    isDowngradable: false,
                    pricingModelId: 6,
                    billingFrequency: 'Upfront',
                    productHierarchyId: 148,
                    productAvailability: 'Current Product',
                    sameUnitPriceForAllTiers: true,
                  },
                  sourceProductId: 12,
                  targetProductId: 9,
                  relationshipType: 'Add On',
                  productRelationshipId: 1,
                },
              ],
              termType: 'years',
              upgrades: [],
              companyId,
              createdAt: '2023-01-17T22:07:32.432Z',
              isEnabled: true,
              productId: 12,
              skuNumber: '08',
              updatedAt: '2023-01-17T22:07:32.432Z',
              downgrades: [],
              priceTiers: [
                {
                  cogsUnit: 750,
                  unitTier: {
                    endRange: 9007199254740991,
                    companyId,
                    createdAt: '2023-01-17T03:40:55.814Z',
                    isEnabled: true,
                    updatedAt: '2023-01-17T03:40:55.814Z',
                    startRange: 1,
                    unitTierId: 15,
                    unitTierName: 'Tier 1',
                    pricingModelId: 6,
                  },
                  companyId,
                  createdAt: '2023-01-17T22:07:32.626Z',
                  isEnabled: true,
                  priceUnit: 1000,
                  productId: 12,
                  updatedAt: '2023-01-17T22:07:32.626Z',
                  unitTierId: 15,
                  priceTierId: 39,
                },
              ],
              isRenewable: false,
              ownerUserId: 2,
              productName: 'High Capacity Server',
              isExpandable: false,
              isUpgradable: false,
              pricingModel: {
                companyId,
                createdAt: '2023-01-17T03:40:55.681Z',
                isEnabled: true,
                modelName: 'Hardware',
                modelType: 'One Time / Non-Recurring',
                updatedAt: '2023-01-17T03:40:55.681Z',
                unitMetric: 'Unit',
                pricingType: 'Flat',
                tiersEnabled: true,
                unitDuration: 'One-Time / Non-Recurring',
                pricingModelId: 6,
              },
              isDowngradable: false,
              pricingModelId: 6,
              billingFrequency: 'Upfront',
              productHierarchy: {
                isActive: true,
                parentId: 143,
                companyId,
                createdAt: '2023-01-17T03:27:25.903Z',
                isEnabled: true,
                updatedAt: '2023-01-17T03:27:25.903Z',
                hierarchyId: 146,
                hierarchyName: '7500',
                hierarchyLevelId: 12,
              },
              productHierarchyId: 146,
              productAvailability: 'Current Product',
              sameUnitPriceForAllTiers: true,
            },
            netPrice: 1000,
            quantity: 1,
            listPrice: 1000,
            startDate: '2023-02-01T00:00:00.000Z',
            priceTiers: [
              {
                cogsUnit: 750,
                unitTier: {
                  endRange: 9007199254740991,
                  companyId,
                  createdAt: '2023-01-17T03:40:55.814Z',
                  isEnabled: true,
                  updatedAt: '2023-01-17T03:40:55.814Z',
                  startRange: 1,
                  unitTierId: 15,
                  unitTierName: 'Tier 1',
                  pricingModelId: 6,
                },
                companyId,
                createdAt: '2023-01-17T22:07:32.626Z',
                isEnabled: true,
                priceUnit: 1000,
                productId: 12,
                updatedAt: '2023-01-17T22:07:32.626Z',
                unitTierId: 15,
                priceTierId: 39,
              },
            ],
            termLength: 0.0026881720430107525,
            dealDuration: 1,
            pricingModel: {
              companyId,
              createdAt: '2023-01-17T03:40:55.681Z',
              isEnabled: true,
              modelName: 'Hardware',
              modelType: 'One Time / Non-Recurring',
              updatedAt: '2023-01-17T03:40:55.681Z',
              unitMetric: 'Unit',
              pricingType: 'Flat',
              tiersEnabled: true,
              unitDuration: 'One-Time / Non-Recurring',
              pricingModelId: 6,
            },
            unitDuration: 1,
            customerPrice: 1000,
            defaultFields: { netPrice: 1000, customerPrice: 1000 },
            listPricePerUnitDuration: 1000,
          },
          isLocked: false,
          isEnabled: true,
          companyId,
        },
      ];

      const quoteCustomerProductEntities = await seedEntities(
        connection,
        OemQuotesCustomerProducts,
        quoteCustomerProducts,
      );

      return quoteCustomerProductEntities;
    }
  };
