import { OemChannelSerializeDto } from './oem-channel.serialize.dto';
import { OemChannelCreateDto } from './oem-channel.create.dto';
import { OemChannelReplaceDto } from './oem-channel.replace.dto';
import { OemChannelUpdateDto } from './oem-channel.update.dto';

export const dto = {
  update: OemChannelUpdateDto,
  replace: OemChannelReplaceDto,
  create: OemChannelCreateDto,
};

export const serialize = {
  get: OemChannelSerializeDto,
  many: OemChannelSerializeDto,
};
