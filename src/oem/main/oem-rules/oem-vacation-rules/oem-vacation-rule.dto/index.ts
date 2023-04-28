import { OemVacationRuleCreateDto } from './oem-vacation-rule.create.dto';
import { OemVacationRuleReplaceDto } from './oem-vacation-rule.replace.dto';
import { OemVacationRuleUpdateDto } from './oem-vacation-rule.update.dto';
import { OemVacationRuleSerializeDto } from './oem-vacation-rule.serialize.dto';

export const dto = {
  create: OemVacationRuleCreateDto,
  update: OemVacationRuleUpdateDto,
  replace: OemVacationRuleReplaceDto,
};

export const serialize = {
  get: OemVacationRuleSerializeDto,
  many: OemVacationRuleSerializeDto,
};
