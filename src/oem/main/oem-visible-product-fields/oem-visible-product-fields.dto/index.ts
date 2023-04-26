import { OemVisibleProductFieldCreateDto } from './oem-visible-product-field.create.dto';
import { OemVisibleProductFieldReplaceDto } from './oem-visible-product-field.replace.dto';
import { OemVisibleProductFieldUpdateDto } from './oem-visible-product-field.update.dto';
import { OemVisibleProductFieldSerializeDto } from './oem-visible-product-field.serialize.dto';

export const dto = {
  create: OemVisibleProductFieldCreateDto,
  update: OemVisibleProductFieldUpdateDto,
  replace: OemVisibleProductFieldReplaceDto,
};

export const serialize = {
  get: OemVisibleProductFieldSerializeDto,
  getMany: OemVisibleProductFieldSerializeDto,
};
