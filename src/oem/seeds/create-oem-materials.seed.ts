import { Factory, Seeder } from 'typeorm-seeding';
import { OemMaterialEntity } from '../main/oem-materials/oem-material.entity';
import { Connection } from 'typeorm';
import { PackagePositionEnum } from '../main/oem-materials/oem-material.enums/package-position.enum';
import { ApplicableToEnum } from '../main/oem-materials/oem-material.enums/applicable-to.enum';

export default class CreateOemMaterials implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const materials: Array<OemMaterialEntity> = [];
    const PACKAGE_POSITION = Object.keys(PackagePositionEnum);
    const APPLICABLE_TO = Object.keys(ApplicableToEnum);
    for (let i = 0; i < PACKAGE_POSITION.length; i++) {
      for (let j = 0; j < APPLICABLE_TO.length; j++) {
        materials[materials.length] = await factory(OemMaterialEntity)().create(
          {
            packagePosition: PackagePositionEnum[PACKAGE_POSITION[i]],
            applicableTo: ApplicableToEnum[APPLICABLE_TO[j]],
          },
        );
      }
    }
    return materials;
  }
}
