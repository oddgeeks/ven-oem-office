import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemCompanyAddressesEntity } from '../../intermediaries/_oem-company-addresses/oem-company-addresses.entity';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemCompanyAddresses implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      return factory(OemCompanyAddressesEntity)().create({
        companyId,
        addressId: 1,
      });
    }
  };
