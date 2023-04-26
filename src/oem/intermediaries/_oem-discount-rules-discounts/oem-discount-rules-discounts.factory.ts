import { define } from 'typeorm-seeding';
import { DiscountRulesDiscounts } from './oem-discount-rules-discounts.entity';

define(DiscountRulesDiscounts, (context) => {
  const discountRulesDiscounts = new DiscountRulesDiscounts();
  discountRulesDiscounts.discountId = 1;
  discountRulesDiscounts.discountRuleId = 1;
  discountRulesDiscounts.companyId = 1;
  return discountRulesDiscounts;
});
