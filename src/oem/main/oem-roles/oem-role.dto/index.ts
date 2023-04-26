import { OemRoleSerializeDto } from './oem-role.serialize.dto';
import { OemRoleCreateDto } from './oem-role.create.dto';
import { OemRoleReplaceDto } from './oem-role.replace.dto';
import { OemRoleUpdateDto } from './oem-role.update.dto';

export const dto = {
  update: OemRoleUpdateDto,
  replace: OemRoleReplaceDto,
  create: OemRoleCreateDto,
};

export const serialize = {
  get: OemRoleSerializeDto,
  getMany: OemRoleSerializeDto,
};
