import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemCompanyEntity } from '../../main/oem-companies/oem-company.entity';

export default ({
  companyId = 2,
  companyName = 'Clean',
  subdomain = 'clean',
  emailDomain = 'bloodandtreasure,vendori',
  companyEmail = '',
}: {
  companyId?: number;
  companyName?: string;
  subdomain?: string;
  emailDomain?: string;
  companyEmail?: string;
}) =>
  class CreateCleanOemCompanies implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      return factory(OemCompanyEntity)().create({
        companyId,
        companyName,
        subdomain,
        emailDomain,
        companyEmail,

        isPermitSigning: true,
      });
    }
  };
