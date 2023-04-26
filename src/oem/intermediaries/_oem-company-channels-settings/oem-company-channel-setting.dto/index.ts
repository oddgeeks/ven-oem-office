import { OemCompanyChannelSettingSerializeDto } from './oem-company-channel-setting.serialize.dto';
import { OemCompanyChannelSettingCreateDto } from './oem-company-channel-setting.create.dto';
import { OemCompanyChannelSettingReplaceDto } from './oem-company-channel-setting.replace.dto';
import { OemCompanyChannelSettingUpdateDto } from './oem-company-channel-setting.update.dto';

export const dto = {
  update: OemCompanyChannelSettingUpdateDto,
  replace: OemCompanyChannelSettingReplaceDto,
  create: OemCompanyChannelSettingCreateDto,
};

export const serialize = {
  get: OemCompanyChannelSettingSerializeDto,
  many: OemCompanyChannelSettingSerializeDto,
};
