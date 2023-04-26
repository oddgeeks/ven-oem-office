import { OemShadingRuleCreatedDto } from './oem-shading-rule.create.dto';
import { OemShadingRuleUpdateDto } from './oem-shading-rule.update.dto';
import { OemShadingRuleReplaceDto } from './oem-shading-rule.replace.dto';
import { OemShadingRuleSerializeDto } from './oem-shading-rule.serialize.dto';

export const dto = {
  create: OemShadingRuleCreatedDto,
  replace: OemShadingRuleReplaceDto,
  update: OemShadingRuleUpdateDto,
};

export const serialize = {
  get: OemShadingRuleSerializeDto,
  many: OemShadingRuleSerializeDto,
};
