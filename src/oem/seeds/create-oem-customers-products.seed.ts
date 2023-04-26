import { Factory, Seeder } from 'typeorm-seeding';
import { OemCustomersProducts } from '../intermediaries/_oem-customers-products/oem-customers-products.entity';
import { Connection } from 'typeorm';

export default class CreateOemCustomersProducts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Disable creating sensitive seed data for now
    if (
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'production'
    )
      return Promise.resolve();

    return await factory(OemCustomersProducts)().create({});
  }
}
