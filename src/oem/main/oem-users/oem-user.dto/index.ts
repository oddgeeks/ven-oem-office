import { OemUserUpdateDto } from './oem-user.update.dto';
import { OemUserCreateDto } from './oem-user.create.dto';
import { OemUserReplaceDto } from './oem-user.replace.dto';
import { OemUserSerializeDto } from './oem-user.serialize.dto';
import { OemUserDeleteDto } from './oem-user.delete.dto';

export const dto = {
  update: OemUserUpdateDto,
  replace: OemUserReplaceDto,
  create: OemUserCreateDto,
};

export const serialize = {
  get: OemUserSerializeDto,
  many: OemUserSerializeDto,
};
