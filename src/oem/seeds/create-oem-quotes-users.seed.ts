import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { QuotesUsers } from '../intermediaries/_oem-quotes-users/oem-quotes-users.entity';

export default class CreateOemQuotesUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    return factory(QuotesUsers)().create();
  }
}
