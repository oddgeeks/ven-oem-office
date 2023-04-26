import { Factory, Seeder } from 'typeorm-seeding';
import { OemCompanyEntity } from '../main/oem-companies/oem-company.entity';
import { Connection } from 'typeorm';

export default class CreateOemCompanies implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    return await factory(OemCompanyEntity)().create({
      companyId: 1,
      subdomain: 'demo',
    });
  }
}
