import { OmitType } from '@nestjs/swagger';
import { ShadingRuleDto } from './oem-shading-rule.dto';
import { IsOptional } from 'class-validator';
import { ShadingRuleLogicType } from '../oem-shading-rule.type/shading-rule-logic.type';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
class ShadingRuleCreateDto extends OmitType(ShadingRuleDto, [
  'shadingRuleId',
  'isEnabled',
  'companyId',
  'createdAt',
  'updatedAt',
  'company',
  'ownerUser',
] as const) {
  @IsOptional()
  shadingRuleLogic: ShadingRuleLogicType;
}

export { ShadingRuleCreateDto as OemShadingRuleCreatedDto };
