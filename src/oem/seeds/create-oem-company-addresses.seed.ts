import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemCompanyAddressesEntity } from '../intermediaries/_oem-company-addresses/oem-company-addresses.entity';

export default class CreateOemCompanyAddresses implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    return factory(OemCompanyAddressesEntity)().create({
      companyId: 1,
      addressId: 1,
    });
  }
}
