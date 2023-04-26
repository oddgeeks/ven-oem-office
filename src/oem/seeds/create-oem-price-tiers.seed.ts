import { Factory, Seeder } from 'typeorm-seeding';
import { OemPriceTierEntity } from '../main/oem-price-tiers/oem-price-tier.entity';
import { Connection } from 'typeorm';

export default class CreateOemPriceTiers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Disable creating sensitive seed data for now
    if (
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'production'
    )
      return Promise.resolve();

    await factory(OemPriceTierEntity)().create({
      priceTierId: 1,
      unitTierId: 1,
      cogsUnit: 346,
      priceUnit: 100,
    });
    await factory(OemPriceTierEntity)().create({
      priceTierId: 1,
      unitTierId: 2,
      cogsUnit: 331,
      priceUnit: 90,
    });
    await factory(OemPriceTierEntity)().create({
      priceTierId: 1,
      unitTierId: 3,
      cogsUnit: 312,
      priceUnit: 100,
    });
  }
}
