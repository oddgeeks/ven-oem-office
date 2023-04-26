import { OemUnitTierCreateDto } from './oem-unit-tier.create.dto';
import { OemUnitTierUpdateDto } from './oem-unit-tier.update.dto';
import { OemUnitTierReplaceDto } from './oem-unit-tier.replace.dto';
import { OemUnitTierSerializeDto } from './oem-unit-tier.serialize.dto';

export const dto = {
  create: OemUnitTierCreateDto,
  update: OemUnitTierUpdateDto,
  replace: OemUnitTierReplaceDto,
};

export const serialize = {
  get: OemUnitTierSerializeDto,
  getMany: OemUnitTierSerializeDto,
};
