import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemHierarchyLevelEntity } from '../../main/oem-hierarchy-levels/oem-hierarchy-level.entity';
import { HierarchyTypeEnum } from '../../main/oem-hierarchy-levels/oem-hierarchy-level.enums/hierarchy-type.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateCleanOemHierarchyLevels implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const hierarchyLevels: Partial<OemHierarchyLevelEntity>[] = [
        {
          companyId,
          levelName: 'Continent',
          hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
          level: 1,
          isEditable: false,
          isEnabled: true,
          isActive: true,
        },
      ];

      const hierarchyLevelEntities = await seedEntities(
        connection,
        OemHierarchyLevelEntity,
        hierarchyLevels,
      );

      return hierarchyLevelEntities;
    }
  };
