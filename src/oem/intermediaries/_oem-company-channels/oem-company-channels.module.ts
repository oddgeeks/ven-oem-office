import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemCompanyChannel } from './oem-company-channel.entity';
import { OemCompanyChannelsService } from './oem-company-channels.service';
import { OemCompanyChannelsController } from './oem-company-channels.controller';
import { OemActionLogEntity } from '../../main/oem-action-logs/oem-action-log.entity';
import { OemCompanyChannelSetting } from '../_oem-company-channels-settings/oem-company-channel-setting.entity';
import { OemChannelEntity } from '../../main/oem-channels/oem-channel.entity';
import { CompanyChannelAddressEntity } from '../_oem-company-channel-addresses/oem-company-channel-addresses.entity';
import { OemAddressEntity } from '../../main/oem-addresses/oem-address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OemCompanyChannel,
      OemCompanyChannelSetting,
      OemAddressEntity,
      CompanyChannelAddressEntity,
      OemChannelEntity,
      OemActionLogEntity,
    ]),
  ],
  providers: [OemCompanyChannelsService],
  exports: [OemCompanyChannelsService],
  controllers: [OemCompanyChannelsController],
})
export class OemCompanyChannelsModule {}
