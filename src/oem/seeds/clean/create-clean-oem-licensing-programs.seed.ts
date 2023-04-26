import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemLicensingProgramEntity } from '../../main/oem-licensing-programs/oem-licensing-program.entity';
import { LicensingProgramTypeEnum } from '../../main/oem-licensing-programs/oem-licensing-program.enums/licensing-program-type.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateCleanOemLicensingPrograms implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const licensingPrograms: Partial<OemLicensingProgramEntity>[] = [
        {
          licensingProgramType: LicensingProgramTypeEnum.CUSTOMER,
          licensingProgramName: 'dogsled',
          companyId,
          discount: 0.1,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.RESELLER,
          licensingProgramName: 'manifestation',
          companyId,
          discount: 0.1,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.DISTRIBUTOR,
          licensingProgramName: 'commuter',
          companyId,
          discount: 0.1,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.RESELLER,
          licensingProgramName: 'exception',
          companyId,
          discount: 0.2,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.DISTRIBUTOR,
          licensingProgramName: 'pecan',
          companyId,
          discount: 0.2,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.RESELLER,
          licensingProgramName: 'chop',
          companyId,
          discount: 0.3,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.DISTRIBUTOR,
          licensingProgramName: 'soot',
          companyId,
          discount: 0.3,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.RESELLER,
          licensingProgramName: 'sundial',
          companyId,
          discount: 0.4,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.DISTRIBUTOR,
          licensingProgramName: 'site',
          companyId,
          discount: 0.4,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.RESELLER,
          licensingProgramName: 'target',
          companyId,
          discount: 0.5,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.DISTRIBUTOR,
          licensingProgramName: 'metaphor',
          companyId,
          discount: 0.5,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.RESELLER,
          licensingProgramName: 'elderberry',
          companyId,
          discount: 0.6,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.DISTRIBUTOR,
          licensingProgramName: 'enforcement',
          companyId,
          discount: 0.6,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.RESELLER,
          licensingProgramName: 'berry',
          companyId,
          discount: 0.7,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.DISTRIBUTOR,
          licensingProgramName: 'grey',
          companyId,
          discount: 0.7,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.RESELLER,
          licensingProgramName: 'nutmeg',
          companyId,
          discount: 0.8,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.DISTRIBUTOR,
          licensingProgramName: 'overload',
          companyId,
          discount: 0.8,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.RESELLER,
          licensingProgramName: 'observatory',
          companyId,
          discount: 0.9,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.DISTRIBUTOR,
          licensingProgramName: 'trailer',
          companyId,
          discount: 0.9,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.RESELLER,
          licensingProgramName: 'ruin',
          companyId,
          discount: 0.1,
          isEnabled: true,
        },
        {
          licensingProgramType: LicensingProgramTypeEnum.DISTRIBUTOR,
          licensingProgramName: 'telescreen',
          companyId,
          discount: 0.1,
          isEnabled: true,
        },
      ];

      const licensingProgramEntities = await seedEntities(
        connection,
        OemLicensingProgramEntity,
        licensingPrograms,
      );

      return licensingProgramEntities;
    }
  };
