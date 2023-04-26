import { Factory, Seeder } from 'typeorm-seeding';
import { OemUnitTierEntity } from '../main/oem-unit-tiers/oem-unit-tier.entity';
import { Connection } from 'typeorm';

export default class CreateOemUnitTiers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Disable creating sensitive seed data for now
    if (
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'production'
    )
      return Promise.resolve();

    await factory(OemUnitTierEntity)().create({
      pricingModelId: 1,
      unitTierName: 'Tier 1',
      startRange: 0,
      endRange: 10,
    });

    await factory(OemUnitTierEntity)().create({
      pricingModelId: 1,
      unitTierName: 'Tier 2',
      startRange: 10,
      endRange: 100,
    });

    await factory(OemUnitTierEntity)().create({
      pricingModelId: 1,
      unitTierName: 'Tier 3',
      startRange: 100,
      endRange: 200,
    });
  }
}
