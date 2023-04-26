import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemContactEntity } from '../../main/oem-contacts/oem-contact.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemContacts implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const contacts: Partial<OemContactEntity>[] = [
        {
          companyOrganisationName: 'Demo',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 929 276-9435',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 929 276-9435',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 929 276-9435',
          isEnabled: false,
          companyId,
        },
        {
          companyOrganisationName: 'Demo',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 929 276-9435',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 929 276-9435',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo & Co.',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 (234) 567-8900',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo & Co.',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 (234) 567-8900',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo & Co.',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 (234) 567-8900',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo & Co.',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 (234) 567-8900',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo & Co.',
          jobTitle: 'Internal',
          lastName: 'G',
          firstName: 'Ethan',
          contactEmail: 'ethan@vendori.com',
          phone: '1234567890',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo & Co.',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 (234) 567-8900',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo & Co.',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 (234) 567-8900',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo & Co.',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 (234) 567-8900',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo & Co.',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 (234) 567-8900',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo & Co.',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 (234) 567-8900',
          isEnabled: true,
          companyId,
        },
        {
          companyOrganisationName: 'Demo & Co.',
          jobTitle: 'Internal',
          lastName: 'Admin',
          firstName: 'Demo',
          contactEmail: 'Demo_admin@vendori.com',
          phone: '+1 (234) 567-8900',
          isEnabled: true,
          companyId,
        },
      ];

      const contactEntities = await seedEntities(
        connection,
        OemContactEntity,
        contacts,
      );

      return contactEntities;
    }
  };
