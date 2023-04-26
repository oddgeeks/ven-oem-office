import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemHierarchyEntity } from '../../main/oem-hierarchies/oem-hierarchy.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateCleanDemoOemHierarchies implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const hierarchies: Partial<OemHierarchyEntity>[] = [
        {
          hierarchyLevelId: 1,
          companyId,
          parentId: 1,
          hierarchyName: 'North America',
          isEnabled: true,
          isActive: true,
        },
      ];

      const hierarchyEntities = await seedEntities(
        connection,
        OemHierarchyEntity,
        hierarchies,
      );

      return hierarchyEntities;
    }
  };
