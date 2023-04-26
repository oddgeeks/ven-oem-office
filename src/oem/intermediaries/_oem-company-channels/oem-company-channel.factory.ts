import { define } from 'typeorm-seeding';

import { OemCompanyChannel } from './oem-company-channel.entity';
import { ChannelTypeEnum } from './oem-company-channel.enums/channel-type.enum';

define(OemCompanyChannel, () => {
  const companyChannel = new OemCompanyChannel();

  companyChannel.companyId = 1;
  companyChannel.companyChannelSettingId = 1;
  companyChannel.geoHierarchyId = 1;
  companyChannel.companyProgramId = 1;
  companyChannel.licensingProgramId = 1;
  companyChannel.channelType = ChannelTypeEnum.RESELLER;

  return companyChannel;
});
