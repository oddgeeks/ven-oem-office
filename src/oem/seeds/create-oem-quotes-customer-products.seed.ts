import { Factory, Seeder } from 'typeorm-seeding';
import { OemQuotesProducts } from '../intermediaries/_oem-quotes-products/oem-quotes-products.entity';
import { Connection } from 'typeorm';

export default class CreateOemQuotesProducts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Disable creating sensitive seed data for now
    if (
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'production'
    )
      return Promise.resolve();

    return await factory(OemQuotesProducts)().create({});
  }
}
