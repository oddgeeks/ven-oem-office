import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemCustomerEntity } from '../../main/oem-customers/oem-customer.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemCustomers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const customers: Partial<OemCustomerEntity>[] = [
        {
          licensingProgramId: 1,
          organizationId: '9a39d9f1-7f9e-4cfa-89f4-bcda3a922133',
          salesOrganizationId: 'ad7f018d-d3a2-4909-a534-648972c9af59',
          customerName: 'MaxieEffertz',
          industry: 'Vehicle',
          customerEmail: 'Brenna49@hotmail.com',
          logoUrl: 'http://loremflickr.com/640/480',
          phone: '+1 929 274-7548',
          isEnabled: true,
          companyId,
        },
        {
          licensingProgramId: 1,
          organizationId: '0065f00000995z2AAA',
          salesOrganizationId: '0015f00000LihGxAAJ',
          customerName: 'Test Account',
          industry: 'Technology',
          customerEmail: 'null',
          logoUrl: 'null',
          phone: '929-248-0000',
          isEnabled: true,
          companyId,
        },
      ];

      const shadingRuleEntities = await seedEntities(
        connection,
        OemCustomerEntity,
        customers,
      );

      return shadingRuleEntities;
    }
  };
