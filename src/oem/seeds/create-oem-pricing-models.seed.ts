import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemPricingModelEntity } from '../main/oem-pricing-models/oem-pricing-model.entity';

export default class CreateOemPricingModels implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Disable creating sensitive seed data for now
    if (
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'production'
    )
      return Promise.resolve();

    return await factory(OemPricingModelEntity)().create();
  }
}
