import { define } from 'typeorm-seeding';
import { Material } from './oem-material.entity';
import { faker } from '@faker-js/faker';
import { ApplicableToEnum } from './oem-material.enums/applicable-to.enum';
import { PackagePositionEnum } from './oem-material.enums/package-position.enum';

define(Material, () => {
  const material = new Material();
  material.materialName = faker.word.noun();
  material.fileUrl =
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  material.isRequired = faker.datatype.boolean();
  material.isEnabled = true;
  material.applicableTo = ApplicableToEnum.BOTH;
  material.packagePosition = PackagePositionEnum.OPTIONAL;
  material.companyId = 1;
  return material;
});
