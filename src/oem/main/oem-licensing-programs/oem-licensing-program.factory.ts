import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

import { LicensingProgram } from './oem-licensing-program.entity';
import { LicensingProgramTypeEnum } from './oem-licensing-program.enums/licensing-program-type.enum';

define(LicensingProgram, () => {
  const licensingProgram: LicensingProgram = new LicensingProgram();

  licensingProgram.companyId = 1;
  licensingProgram.licensingProgramType = LicensingProgramTypeEnum.CUSTOMER;
  licensingProgram.discount = 0.1;
  licensingProgram.licensingProgramName = faker.word.noun();
  licensingProgram.isEnabled = true;

  return licensingProgram;
});
