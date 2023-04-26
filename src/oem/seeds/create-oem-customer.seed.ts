import { Factory, Seeder } from 'typeorm-seeding';
import { OemCustomerEntity } from '../main/oem-customers/oem-customer.entity';
import { Connection } from 'typeorm';

export default class CreateOemCustomer implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    return await factory(OemCustomerEntity)().create();
  }
}
