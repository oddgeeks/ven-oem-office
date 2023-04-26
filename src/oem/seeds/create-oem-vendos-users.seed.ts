import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { VendosUsers } from '../intermediaries/_oem-vendos-users/oem-vendos-users.entity';

export default class CreateOemVendosUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    return factory(VendosUsers)().create();
  }
}
