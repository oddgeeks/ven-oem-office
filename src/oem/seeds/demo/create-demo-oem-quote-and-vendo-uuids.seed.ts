import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemQuoteAndVendoUuid } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuid.entity';
import { UuidTypesEnum } from '../../intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo.enums/uuid-types.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemQuoteAndVendoUuids implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const quoteAndVendoUuids: Partial<OemQuoteAndVendoUuid>[] = [
        {
          quoteAndVendoUuidType: UuidTypesEnum.QUOTE,
          companyId,
          prefix: 'Q-',
          lastUuid: 21,
          isEnabled: true,
        },
      ];

      const quoteAndVendoUuidEntities = await seedEntities(
        connection,
        OemQuoteAndVendoUuid,
        quoteAndVendoUuids,
      );

      return quoteAndVendoUuidEntities;
    }
  };
