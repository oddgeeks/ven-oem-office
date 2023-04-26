import { OemVendoUpdateDto } from './oem-vendo.update.dto';
import { OemVendoReplaceDto } from './oem-vendo.replace.dto';
import { OemVendoCreateDto } from './oem-vendo.create.dto';
import { OemVendoSerializeDto } from './oem-vendo.serialize.dto';

export const dto = {
  update: OemVendoUpdateDto,
  replace: OemVendoReplaceDto,
  create: OemVendoCreateDto,
};

export const serialize = {
  get: OemVendoSerializeDto,
  getMany: OemVendoSerializeDto,
};
