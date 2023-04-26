import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { OemCompanyChannel } from '../intermediaries/_oem-company-channels/oem-company-channel.entity';
import { ChannelTypeEnum } from '../intermediaries/_oem-company-channels/oem-company-channel.enums/channel-type.enum';

export default class CreateOemCompanyChannels implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const companyChannels = [];
    companyChannels[0] = await factory(OemCompanyChannel)().create({
      companyChannelId: 1,
      companyId: 1,
      companyProgramId: 1,
      licensingProgramId: 1,
      channelType: ChannelTypeEnum.RESELLER,
      companyChannelSettingId: 1,
    });
    companyChannels[1] = await factory(OemCompanyChannel)().create({
      companyId:1,
      companyChannelId: 2,
      companyProgramId: 2,
      licensingProgramId: 2,
      channelType: ChannelTypeEnum.DISTRIBUTOR,
      companyChannelSettingId: 2,
    });

    return companyChannels[0];
  }
}
