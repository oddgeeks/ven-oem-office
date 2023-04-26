import { OemProductCreateDto } from './oem-product.create.dto';
import { OemProductReplaceDto } from './oem-product.replace.dto';
import { OemProductUpdateDto } from './oem-product.update.dto';
import { OemProductSerializeDto } from './oem-product.serialize.dto';

export const dto = {
  create: OemProductCreateDto,
  replace: OemProductReplaceDto,
  update: OemProductUpdateDto,
};

export const serialize = {
  get: OemProductSerializeDto,
  getMany: OemProductSerializeDto,
};
