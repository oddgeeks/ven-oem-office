import { OemVendosUsersCreateDto } from './oem-vendos-users.create.dto';
import { OemVendosUsersUpdateDto } from './oem-vendos-users.update.dto';
import { OemVendosUsersReplaceDto } from './oem-vendos-users.replace.dto';
import { OemVendosUsersSerializeDto } from './oem-vendos-users.serialize.dto';

export const dto = {
  create: OemVendosUsersCreateDto,
  update: OemVendosUsersUpdateDto,
  replace: OemVendosUsersReplaceDto,
};

export const serialize = {
  get: OemVendosUsersSerializeDto,
  many: OemVendosUsersSerializeDto,
};
