import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemCustomerAddresses } from '../intermediaries/_oem-customer-addresses/oem-customer-addresses.entity';

export default class CreateOemCustomerAddresses implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(OemCustomerAddresses)().create({
      companyId: 1,
      customerId: 1,
      addressId: 1,
    });
    return await factory(OemCustomerAddresses)().create({
      companyId: 1,
      customerId: 1,
      addressId: 2,
    });
  }
}
