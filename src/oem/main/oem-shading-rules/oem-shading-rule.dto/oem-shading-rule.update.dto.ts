import { OmitType } from '@nestjs/swagger';
import { ShadingRuleDto } from './oem-shading-rule.dto';
import { IsOptional } from 'class-validator';
import { ShadingRuleLogicType } from '../oem-shading-rule.type/shading-rule-logic.type';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ShadingRuleUpdateDto extends OmitType(ShadingRuleDto, [
  'shadingRuleId',
  'isEnabled',
  'companyId',
  'ownerUserId',
  'createdAt',
  'updatedAt',
  'company',
  'ownerUser',
] as const) {
  @IsOptional()
  priority: number;

  @IsOptional()
  shadingRuleName: string;

  @IsOptional()
  shadingRuleLogic: ShadingRuleLogicType;
}

export { ShadingRuleUpdateDto as OemShadingRuleUpdateDto };
