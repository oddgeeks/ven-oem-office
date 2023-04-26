import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemQuotesMaterials } from '../../intermediaries/_oem-quotes-materials/oem-quotes-materials.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemQuoteMaterials implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const quoteMaterials: Partial<OemQuotesMaterials>[] = [
        {
          materialId: 3,
          position: -1,
          isEnabled: true,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: true,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: true,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: true,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: false,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: false,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: false,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: false,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: false,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: false,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: true,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: true,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: true,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: true,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: true,
          companyId,
        },
        {
          materialId: 3,
          position: -1,
          isEnabled: true,
          companyId,
        },
      ];

      const quoteMaterialEntities = await seedEntities(
        connection,
        OemQuotesMaterials,
        quoteMaterials,
      );

      return quoteMaterialEntities;
    }
  };
