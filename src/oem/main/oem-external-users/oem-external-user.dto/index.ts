import { OemUserSerializeDto } from '../../oem-users/oem-user.dto/oem-user.serialize.dto';
import { OemExternalUserUpdateDto } from './oem-external-user.update.dto';
import { OemExternalUserCreateDto } from './oem-external-user.create.dto';
import { OemExternalUserReplaceDto } from './oem-external-user.replace.dto';

export const dto = {
  update: OemExternalUserUpdateDto,
  replace: OemExternalUserReplaceDto,
  create: OemExternalUserCreateDto,
};

export const serialize = {
  get: OemUserSerializeDto,
  many: OemUserSerializeDto,
};
