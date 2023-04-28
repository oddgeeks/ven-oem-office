import { OemDiscountRuleCreateDto } from './oem-discount-rule.create.dto';
import { OemDiscountRuleReplaceDto } from './oem-discount-rule.replace.dto';
import { OemDiscountRuleUpdateDto } from './oem-discount-rule.update.dto';
import { OemDiscountSerializeDto } from '../../../oem-discounts/oem-discount.dto/oem-discount.serialize.dto';

export const dto = {
  create: OemDiscountRuleCreateDto,
  update: OemDiscountRuleUpdateDto,
  replace: OemDiscountRuleReplaceDto,
};

export const serialize = {
  get: OemDiscountSerializeDto,
  getMany: OemDiscountSerializeDto,
};
