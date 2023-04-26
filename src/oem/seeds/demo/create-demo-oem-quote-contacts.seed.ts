import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemQuotesContacts } from '../../intermediaries/_oem-quotes-contacts/oem-quotes-contacts.entity';
import { TypeEnum } from '../../intermediaries/_oem-quotes-contacts/oem-quotes-contacts.enums/type.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemQuoteContacts implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const quoteContacts: Partial<OemQuotesContacts>[] = [
        {
          contactId: 1,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: false,
          isOwner: true,
          companyId,
        },
        {
          contactId: 6,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: true,
          isOwner: true,
          companyId,
        },
        {
          contactId: 6,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: true,
          isOwner: true,
          companyId,
        },
        {
          contactId: 8,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: true,
          isOwner: true,
          companyId,
        },
        {
          contactId: 5,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: false,
          isOwner: true,
          companyId,
        },
        {
          contactId: 4,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: false,
          isOwner: true,
          companyId,
        },
        {
          contactId: 3,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: false,
          isOwner: true,
          companyId,
        },
        {
          contactId: 2,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: false,
          isOwner: true,
          companyId,
        },
        {
          contactId: 9,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: true,
          isOwner: true,
          companyId,
        },
        {
          contactId: 8,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: false,
          isOwner: true,
          companyId,
        },
        {
          contactId: 6,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: false,
          isOwner: true,
          companyId,
        },
        {
          contactId: 8,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: false,
          isOwner: true,
          companyId,
        },
        {
          contactId: 6,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: false,
          isOwner: true,
          companyId,
        },
        {
          contactId: 6,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: false,
          isOwner: true,
          companyId,
        },
        {
          contactId: 8,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: false,
          isOwner: true,
          companyId,
        },
        {
          contactId: 42,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: true,
          isOwner: true,
          companyId,
        },
        {
          contactId: 43,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: true,
          isOwner: true,
          companyId,
        },
        {
          contactId: 46,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: true,
          isOwner: true,
          companyId,
        },
        {
          contactId: 47,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: true,
          isOwner: true,
          companyId,
        },
        {
          contactId: 8,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: true,
          isOwner: true,
          companyId,
        },
        {
          contactId: 48,
          position: 1,
          type: TypeEnum.INTERNAL,
          isEnabled: true,
          isOwner: true,
          companyId,
        },
      ];

      const quoteContactEntities = await seedEntities(
        connection,
        OemQuotesContacts,
        quoteContacts,
      );

      return quoteContactEntities;
    }
  };
