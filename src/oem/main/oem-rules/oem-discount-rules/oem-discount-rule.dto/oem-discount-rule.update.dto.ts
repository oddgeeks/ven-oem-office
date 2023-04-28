import { OmitType } from '@nestjs/swagger';
import { DiscountRule } from '../oem-discount-rule.entity';
import { OemDiscountRuleDto } from './oem-discount-rule.dto';
import { IsOptional } from 'class-validator';
import { DiscountRuleLogicType } from '../oem-discount-rule.types/discount-rule-logic.type';
import { DiscountRuleTypeEnum } from '../oem-discount-rule.enums/discount-rule.enum';

export class DiscountRuleUpdateDto extends OmitType(OemDiscountRuleDto, [
  'discountRuleId',
  'isEnabled',
  'companyId',
  'createdAt',
  'updatedAt',
] as const) {
  constructor(data: Partial<DiscountRule> = {}) {
    super();
    Object.assign(this, data);
  }
  @IsOptional()
  companyId: number;
  @IsOptional()
  ownerUserId: number;
  @IsOptional()
  discountRuleName: string;
  @IsOptional()
  discountRuleLogic: DiscountRuleLogicType;
  @IsOptional()
  discountRuleType: DiscountRuleTypeEnum;
  @IsOptional()
  isActive: boolean;
}

export { DiscountRuleUpdateDto as OemDiscountRuleUpdateDto };
