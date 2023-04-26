import { OemPriceTierCreateDto } from './oem-price-tier.create.dto';
import { OemPriceTierReplaceDto } from './oem-price-tier.replace.dto';
import { OemPriceTierUpdateDto } from './oem-price-tier.update.dto';
import { OemPriceTierSerializeDto } from './oem-price-tier.serialize.dto';

export const dto = {
  create: OemPriceTierCreateDto,
  replace: OemPriceTierReplaceDto,
  update: OemPriceTierUpdateDto,
};

export const serialize = {
  get: OemPriceTierSerializeDto,
  getMany: OemPriceTierSerializeDto,
};
