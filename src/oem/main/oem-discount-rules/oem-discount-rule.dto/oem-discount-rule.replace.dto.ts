import { OmitType } from '@nestjs/swagger';
import { DiscountRule } from '../oem-discount-rule.entity';
import { OemDiscountRuleDto } from './oem-discount-rule.dto';

export class DiscountRuleReplaceDto extends OmitType(OemDiscountRuleDto, [
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
}

export { DiscountRuleReplaceDto as OemDiscountRuleReplaceDto };
