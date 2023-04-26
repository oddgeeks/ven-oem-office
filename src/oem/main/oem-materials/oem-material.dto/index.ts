import { OemMaterialCreateDto } from './oem-material.create.dto';
import { OemMaterialUpdateDto } from './oem-material.update.dto';
import { OemMaterialReplaceDto } from './oem-material.replace.dto';
import { OemMaterialSerializeDto } from './oem-material.serialize.dto';

export const dto = {
  create: OemMaterialCreateDto,
  update: OemMaterialUpdateDto,
  replace: OemMaterialReplaceDto,
};

export const serialize = {
  get: OemMaterialSerializeDto,
  getMany: OemMaterialSerializeDto,
};
