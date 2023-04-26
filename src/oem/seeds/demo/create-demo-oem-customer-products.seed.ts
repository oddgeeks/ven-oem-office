import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as moment from 'moment-timezone';

import { OemCustomersProducts } from '../../intermediaries/_oem-customers-products/oem-customers-products.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemCustomerProducts implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const customerProducts: Partial<OemCustomersProducts>[] = [
        {
          productId: 5,
          customerId: 1,
          quantity: 1,
          endDate: moment.utc('2026-01-15 00:00:00.000000 +00:00').toDate(),
          customerPrice: 0,
          netPrice: 0,
          isEnabled: false,
          companyId,
        },
        {
          productId: 1,
          customerId: 1,
          quantity: 1,
          endDate: moment.utc('2026-01-12 00:00:00.000000 +00:00').toDate(),
          customerPrice: 0,
          netPrice: 0,
          isEnabled: false,
          companyId,
        },
        {
          productId: 4,
          customerId: 1,
          quantity: 1,
          endDate: moment.utc('2023-06-15 00:00:00.000000 +00:00').toDate(),
          customerPrice: 0,
          netPrice: 0,
          isEnabled: false,
          companyId,
        },
        {
          productId: 4,
          customerId: 1,
          quantity: 1,
          endDate: moment.utc('2023-06-15 00:00:00.000000 +00:00').toDate(),
          customerPrice: 0,
          netPrice: 0,
          isEnabled: false,
          companyId,
        },
        {
          productId: 12,
          customerId: 1,
          quantity: 1,
          endDate: moment.utc('2023-02-01 00:00:00.000000 +00:00').toDate(),
          customerPrice: 0,
          netPrice: 0,
          isEnabled: true,
          companyId,
        },
      ];

      const customerProductEntities = await seedEntities(
        connection,
        OemCustomersProducts,
        customerProducts,
      );

      return customerProductEntities;
    }
  };
