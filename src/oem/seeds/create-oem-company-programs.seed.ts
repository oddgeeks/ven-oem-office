import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { OemCompanyProgram } from '../intermediaries/_oem-company-programs/oem-company-program.entity';

export default class CreateOemCompanyPrograms implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const companyPrograms = [];
    companyPrograms[0] = await factory(OemCompanyProgram)().create({
      companyProgramId: 1,
      companyId: 1,
      channelId: 1,
    });
    companyPrograms[1] = await factory(OemCompanyProgram)().create({
      companyProgramId: 2,
      companyId: 1,
      channelId: 2,
    });

    return companyPrograms[0];
  }
}
