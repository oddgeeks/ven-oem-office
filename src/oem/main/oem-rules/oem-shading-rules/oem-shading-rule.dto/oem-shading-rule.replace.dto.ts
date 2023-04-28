import { OmitType } from '@nestjs/swagger';
import { ShadingRuleDto } from './oem-shading-rule.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ShadingRuleReplaceDto extends OmitType(ShadingRuleDto, [
  'shadingRuleId',
  'isEnabled',
  'companyId',
  'createdAt',
  'updatedAt',
  'company',
  'ownerUser',
] as const) {}

export { ShadingRuleReplaceDto as OemShadingRuleReplaceDto };
