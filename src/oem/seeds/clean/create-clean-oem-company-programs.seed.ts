import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemCompanyProgram } from '../../intermediaries/_oem-company-programs/oem-company-program.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateCleanOemCompanyPrograms implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const companyPrograms: Partial<OemCompanyProgram>[] = [
        {
          companyProgramId: 1,
          companyId,
          channelId: 1,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 2,
          companyId,
          channelId: 1,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 3,
          companyId,
          channelId: 2,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 4,
          companyId,
          channelId: 2,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 5,
          companyId,
          channelId: 3,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 6,
          companyId,
          channelId: 3,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 7,
          companyId,
          channelId: 4,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 8,
          companyId,
          channelId: 4,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 9,
          companyId,
          channelId: 5,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 10,
          companyId,
          channelId: 5,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 11,
          companyId,
          channelId: 6,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 12,
          companyId,
          channelId: 6,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 13,
          companyId,
          channelId: 7,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 14,
          companyId,
          channelId: 7,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 15,
          companyId,
          channelId: 8,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 16,
          companyId,
          channelId: 8,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 17,
          companyId,
          channelId: 9,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 18,
          companyId,
          channelId: 9,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 19,
          companyId,
          channelId: 10,
          name: 'NA',
          isEnabled: true,
        },
        {
          companyProgramId: 20,
          companyId,
          channelId: 10,
          name: 'NA',
          isEnabled: true,
        },
      ];

      const companyProgramEntities = await seedEntities(
        connection,
        OemCompanyProgram,
        companyPrograms,
      );

      return companyProgramEntities;
    }
  };
