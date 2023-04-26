import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemCompanyEntity } from '../../main/oem-companies/oem-company.entity';

export default ({
  companyId = 1,
  companyName = 'Demo & Co.',
  subdomain = 'demo',
}: {
  companyId?: number;
  companyName?: string;
  subdomain?: string;
}) =>
  class CreateDemoOemCompanies implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      return factory(OemCompanyEntity)().create({
        companyId,
        companyName,
        subdomain,

        isPermitSigning: true,
      });
    }
  };
