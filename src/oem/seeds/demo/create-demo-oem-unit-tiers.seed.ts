import { Factory, Seeder } from 'typeorm-seeding';
import { OemUnitTierEntity } from '../../main/oem-unit-tiers/oem-unit-tier.entity';
import { Connection } from 'typeorm';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemUnitTiers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const unitTiers: Partial<OemUnitTierEntity>[] = [
        {
          pricingModelId: 1,
          unitTierName: 'Tier 1',
          startRange: 1,
          endRange: 50,
          isEnabled: false,
          companyId,
        },
        {
          pricingModelId: 1,
          unitTierName: 'Tier 2',
          startRange: 51,
          endRange: 200,
          isEnabled: false,
          companyId,
        },
        {
          pricingModelId: 1,
          unitTierName: 'Tier 3',
          startRange: 201,
          endRange: 9.0072e15,
          isEnabled: false,
          companyId,
        },
        {
          pricingModelId: 2,
          unitTierName: 'Tier 3',
          startRange: 201,
          endRange: 9.0072e15,
          isEnabled: false,
          companyId,
        },
        {
          pricingModelId: 3,
          unitTierName: 'Tier 2',
          startRange: 101,
          endRange: 9.0072e15,
          isEnabled: false,
          companyId,
        },
        {
          pricingModelId: 2,
          unitTierName: 'Tier 2',
          startRange: 101,
          endRange: 300,
          isEnabled: false,
          companyId,
        },
        {
          pricingModelId: 3,
          unitTierName: 'Tier 1',
          startRange: 1,
          endRange: 9.0072e15,
          isEnabled: false,
          companyId,
        },
        {
          pricingModelId: 4,
          unitTierName: 'Tier 1',
          startRange: 1,
          endRange: 9.0072e15,
          isEnabled: false,
          companyId,
        },
        {
          pricingModelId: 2,
          unitTierName: 'Tier 1',
          startRange: 1,
          endRange: 9.0072e15,
          isEnabled: false,
          companyId,
        },
        {
          pricingModelId: 5,
          unitTierName: 'Tier 1',
          startRange: 1,
          endRange: 200,
          isEnabled: true,
          companyId,
        },
        {
          pricingModelId: 5,
          unitTierName: 'Tier 2',
          startRange: 201,
          endRange: 300,
          isEnabled: true,
          companyId,
        },
        {
          pricingModelId: 5,
          unitTierName: 'Tier 3',
          startRange: 301,
          endRange: 400,
          isEnabled: true,
          companyId,
        },
        {
          pricingModelId: 5,
          unitTierName: 'Tier 4',
          startRange: 401,
          endRange: 500,
          isEnabled: true,
          companyId,
        },
        {
          pricingModelId: 5,
          unitTierName: 'Tier 5',
          startRange: 501,
          endRange: 600,
          isEnabled: true,
          companyId,
        },
        {
          pricingModelId: 6,
          unitTierName: 'Tier 1',
          startRange: 1,
          endRange: 9.0072e15,
          isEnabled: true,
          companyId,
        },
        {
          pricingModelId: 7,
          unitTierName: 'Tier 1',
          startRange: 1,
          endRange: 50,
          isEnabled: true,
          companyId,
        },
        {
          pricingModelId: 7,
          unitTierName: 'Tier 2',
          startRange: 51,
          endRange: 100,
          isEnabled: true,
          companyId,
        },
        {
          pricingModelId: 7,
          unitTierName: 'Tier 3',
          startRange: 101,
          endRange: 9.0072e15,
          isEnabled: true,
          companyId,
        },
        {
          pricingModelId: 8,
          unitTierName: 'Tier 1',
          startRange: 1,
          endRange: 9.0072e15,
          isEnabled: true,
          companyId,
        },
        {
          pricingModelId: 10,
          unitTierName: 'Tier 1',
          startRange: 1,
          endRange: 9.0072e15,
          isEnabled: false,
          companyId,
        },
        {
          pricingModelId: 9,
          unitTierName: 'Tier 1',
          startRange: 1,
          endRange: 100,
          isEnabled: false,
          companyId,
        },
        {
          pricingModelId: 9,
          unitTierName: 'Tier 2',
          startRange: 101,
          endRange: 9.0072e15,
          isEnabled: false,
          companyId,
        },
        {
          pricingModelId: 11,
          unitTierName: 'Tier 1',
          startRange: 1,
          endRange: 9.0072e15,
          isEnabled: false,
          companyId,
        },
      ];

      const unitTierEntities = await seedEntities(
        connection,
        OemUnitTierEntity,
        unitTiers,
      );

      return unitTierEntities;
    }
  };
