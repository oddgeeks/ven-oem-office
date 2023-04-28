import { OmitType } from '@nestjs/swagger';
import { DiscountRule } from '../oem-discount-rule.entity';
import { OemDiscountRuleDto } from './oem-discount-rule.dto';

export class DiscountRuleCreateDto extends OmitType(OemDiscountRuleDto, [
  'discountRuleId',
  'isEnabled',
  'companyId',
  // 'startDate',
  // 'endDate',
  'createdAt',
  'updatedAt',
] as const) {
  constructor(data: Partial<DiscountRule> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { DiscountRuleCreateDto as OemDiscountRuleCreateDto };
