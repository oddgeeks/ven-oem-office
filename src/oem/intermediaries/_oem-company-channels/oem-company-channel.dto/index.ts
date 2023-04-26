import { OemCompanyChannelSerializeDto } from './oem-company-channel.serialize.dto';
import { OemCompanyChannelCreateDto } from './oem-company-channel.create.dto';
import { OemCompanyChannelReplaceDto } from './oem-company-channel.replace.dto';
import { OemCompanyChannelUpdateDto } from './oem-company-channel.update.dto';

export const dto = {
  update: OemCompanyChannelUpdateDto,
  replace: OemCompanyChannelReplaceDto,
  create: OemCompanyChannelCreateDto,
};

export const serialize = {
  get: OemCompanyChannelSerializeDto,
  many: OemCompanyChannelSerializeDto,
};
