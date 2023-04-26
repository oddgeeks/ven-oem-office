import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemCompanyChannel } from '../../intermediaries/_oem-company-channels/oem-company-channel.entity';
import { ChannelTypeEnum } from '../../intermediaries/_oem-company-channels/oem-company-channel.enums/channel-type.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemCompanyChannels implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      // Please give me 6 total lines:
      // Distributor #1, 2, 3
      // Reseller #1, 2, 3
      // Give each one a different territory and contact email (distributor1@vendori.com, etc.)
      // Use vendori.com domains so we don't send externally
      const companyChannels: Partial<OemCompanyChannel>[] = [
        {
          companyId,
          companyChannelSettingId: 1,
          geoHierarchyId: 1, // North America
          companyProgramId: 1,
          channelType: ChannelTypeEnum.DISTRIBUTOR,
          isActive: true,
          isEnabled: true,
          licensingProgramId: 2,
        },
        {
          companyId,
          companyChannelSettingId: 2,
          geoHierarchyId: 2, // USA
          companyProgramId: 2,
          channelType: ChannelTypeEnum.RESELLER,
          isActive: true,
          isEnabled: true,
          licensingProgramId: 3,
        },
        {
          companyId,
          companyChannelSettingId: 3,
          geoHierarchyId: 11, // Europe
          companyProgramId: 3,
          channelType: ChannelTypeEnum.DISTRIBUTOR,
          isActive: true,
          isEnabled: true,
          licensingProgramId: 4,
        },
        {
          companyId,
          companyChannelSettingId: 4,
          geoHierarchyId: 18, // Asia
          companyProgramId: 4,
          channelType: ChannelTypeEnum.RESELLER,
          isActive: true,
          isEnabled: true,
          licensingProgramId: 5,
        },
        {
          companyId,
          companyChannelSettingId: 5,
          geoHierarchyId: 114, // Canada
          companyProgramId: 5,
          channelType: ChannelTypeEnum.DISTRIBUTOR,
          isActive: true,
          isEnabled: true,
          licensingProgramId: 6,
        },
        {
          companyId,
          companyChannelSettingId: 6,
          geoHierarchyId: 19, // China
          companyProgramId: 6,
          channelType: ChannelTypeEnum.RESELLER,
          isActive: true,
          isEnabled: true,
          licensingProgramId: 7,
        },
      ];

      const companyChannelEntities = await seedEntities(
        connection,
        OemCompanyChannel,
        companyChannels,
      );

      return companyChannelEntities;
    }
  };
