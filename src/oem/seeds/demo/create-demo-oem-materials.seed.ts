import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemMaterialEntity } from '../../main/oem-materials/oem-material.entity';
import { PackagePositionEnum } from '../../main/oem-materials/oem-material.enums/package-position.enum';
import { ApplicableToEnum } from '../../main/oem-materials/oem-material.enums/applicable-to.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemMaterials implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const materials: Partial<OemMaterialEntity>[] = [
        {
          materialName: 'CoverPage',
          fileUrl:
            'https://files.vendori.com/pdf/089b085e-d2d6-4dd3-80ed-793c32010b10.pdf?Expires=1705461274&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9maWxlcy52ZW5kb3JpLmNvbS9wZGYvMDg5YjA4NWUtZDJkNi00ZGQzLTgwZWQtNzkzYzMyMDEwYjEwLnBkZiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTcwNTQ2MTI3NH19fV19&Signature=y9a~QRMSj22y5na9OXP7ACogMUiWa0o3ukOz7KjFzzXEwBQAQrLsu-Wa2betd0~BMypV-dWLe5o-dhcgNCt-5cN0v8X8vBBvpu1VmkHwwTL1o9TMJoVuedVkin0RInzmRjIN38JaU~yXIHyYexSSdEO50zHnOyrBRaUzLgewbvsrC7PfAzFQlNk4O2gCKNVvsRX3GGgbfhv4umaqqj30J~-F3uAnd~HozRi5vv8ErStVj7OkdnufO1CXnke4b6lZBCCpmc2iXzMORQ8oZzlYwCvP2fwW6nUaLWlvmYIUbJGqwpuupQPAw8RkDiKYs7bPxraUebNv251OS1d5d-4CJQ__&Key-Pair-Id=K3W4UV0J4B6YE7',
          isRequired: true,
          packagePosition: PackagePositionEnum.BEFORE,
          isEnabled: true,
          applicableTo: ApplicableToEnum.QUOTE,
          companyId,
        },
      ];

      const materialEntities = await seedEntities(
        connection,
        OemMaterialEntity,
        materials,
      );

      return materialEntities;
    }
  };
