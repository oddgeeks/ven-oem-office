import { define } from 'typeorm-seeding';
import { DiscountPriorities } from './oem-discount-priorities.entity';

define(DiscountPriorities, (context) => {
  const discountPriorities = new DiscountPriorities();
  discountPriorities.sourceDiscountId = 1;
  discountPriorities.targetDiscountId = 2;
  discountPriorities.companyId = 1;
  discountPriorities.priority = 1;
  return discountPriorities;
});
