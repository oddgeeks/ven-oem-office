import { PartialType } from '@nestjs/swagger';
import { OemCompanyChannelSettingDto } from './oem-company-channel-setting.dto';
import { OemCompanyChannelSetting } from '../oem-company-channel-setting.entity';

export class CompanyChannelSettingSerializeDto extends PartialType(
  OemCompanyChannelSettingDto,
) {
  constructor(data: Partial<OemCompanyChannelSetting> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { CompanyChannelSettingSerializeDto as OemCompanyChannelSettingSerializeDto };
