import { OemDiscountCreateDto } from './oem-discount.create.dto';
import { OemDiscountReplaceDto } from './oem-discount.replace.dto';
import { OemDiscountUpdateDto } from './oem-discount.update.dto';
import { OemDiscountSerializeDto } from './oem-discount.serialize.dto';

export const dto = {
  create: OemDiscountCreateDto,
  update: OemDiscountUpdateDto,
  replace: OemDiscountReplaceDto,
};

export const serialize = {
  get: OemDiscountSerializeDto,
  getMany: OemDiscountSerializeDto,
};
