import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemLicensingProgramEntity } from '../main/oem-licensing-programs/oem-licensing-program.entity';
import { LicensingProgramTypeEnum } from '../main/oem-licensing-programs/oem-licensing-program.enums/licensing-program-type.enum';

export default class CreateOemLicensingPrograms implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(OemLicensingProgramEntity)().create({
      licensingProgramId: 1,
      licensingProgramType: LicensingProgramTypeEnum.RESELLER,
      discount: 0.15,
    });
    await factory(OemLicensingProgramEntity)().create({
      licensingProgramId: 2,
      licensingProgramType: LicensingProgramTypeEnum.DISTRIBUTOR,
      discount: 0.15,
    });
    await factory(OemLicensingProgramEntity)().create({
      licensingProgramId: 3,
      licensingProgramType: LicensingProgramTypeEnum.CUSTOMER,
      discount: 0.15,
    });
  }
}
