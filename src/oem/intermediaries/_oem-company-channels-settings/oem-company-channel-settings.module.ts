import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemCompanyChannelSetting } from './oem-company-channel-setting.entity';
import { OemCompanyChannelSettingsService } from './oem-company-channel-settings.service';
import { OemCompanyChannelSettingsController } from './oem-company-channel-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemCompanyChannelSetting])],
  providers: [OemCompanyChannelSettingsService],
  exports: [OemCompanyChannelSettingsService],
  controllers: [OemCompanyChannelSettingsController],
})
export class OemCompanyChannelSettingsModule {}
