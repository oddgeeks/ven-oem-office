import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemCustomerAddresses } from '../../intermediaries/_oem-customer-addresses/oem-customer-addresses.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemCustomerAddresses implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const customerAddresses: Partial<OemCustomerAddresses>[] = [
        {
          companyId,
          customerId: 1,
          addressId: 3,
          isEnabled: true,
        },
        {
          companyId,
          customerId: 1,
          addressId: 4,
          isEnabled: true,
        },
        {
          companyId,
          customerId: 2,
          addressId: 5,
          isEnabled: true,
        },
        {
          companyId,
          customerId: 2,
          addressId: 6,
          isEnabled: true,
        },
      ];

      const customerAddressEntities = await seedEntities(
        connection,
        OemCustomerAddresses,
        customerAddresses,
      );

      return customerAddressEntities;
    }
  };
