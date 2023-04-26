import { OemPricingModelCreateDto } from './oem-pricing-model.create.dto';
import { OemPricingModelUpdateDto } from './oem-pricing-model.update.dto';
import { OemPricingModelReplaceDto } from './oem-pricing-model.replace.dto';
import { OemPricingModelSerializeDto } from './oem-pricing-model.serialize.dto';

export const dto = {
  create: OemPricingModelCreateDto,
  update: OemPricingModelUpdateDto,
  replace: OemPricingModelReplaceDto,
};

export const serialize = {
  get: OemPricingModelSerializeDto,
  getMany: OemPricingModelSerializeDto,
};
