import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { DiscountRule } from '../oem-discount-rule.entity';
import { OemDiscountRuleDto } from './oem-discount-rule.dto';

export class DiscountRuleSerializeDto extends PartialType(OemDiscountRuleDto) {
  constructor(data: Partial<DiscountRule> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { DiscountRuleSerializeDto as OemDiscountRuleSerializeDto };
