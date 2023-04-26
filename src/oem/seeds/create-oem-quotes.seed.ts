import { Factory, Seeder } from 'typeorm-seeding';
import { OemQuoteEntity } from '../main/oem-quotes/oem-quote.entity';
import { Connection } from 'typeorm';

export default class CreateOemQuotes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    return await factory(OemQuoteEntity)().create({ companyId: 1 });
  }
}
