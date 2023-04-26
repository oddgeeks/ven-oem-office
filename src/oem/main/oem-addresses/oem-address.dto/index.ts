import { OemAddressUpdateDto } from './oem-address.update.dto';
import { OemAddressReplaceDto } from './oem-address.replace.dto';
import { OemAddressCreateDto } from './oem-address.create.dto';
import { OemAddressSerializeDto } from './oem-address.serialize.dto';

export const dto = {
  update: OemAddressUpdateDto,
  replace: OemAddressReplaceDto,
  create: OemAddressCreateDto,
};

export const serialize = {
  get: OemAddressSerializeDto,
  many: OemAddressSerializeDto,
};
