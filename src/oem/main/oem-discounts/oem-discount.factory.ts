import { define } from 'typeorm-seeding';
import { Discount } from './oem-discount.entity';
import { DiscountTypeEnum } from './oem-discount.enums/discount-type.enum';
import { ApplicableToEnum } from './oem-discount.enums/applicable-to.enum';
import { PositionEnum } from './oem-discount.enums/position.enum';

define(Discount, (context) => {
  const discount = new Discount();
  discount.discountId = 1;
  discount.companyId = 1;
  discount.discountType = DiscountTypeEnum.PROGRAM;
  discount.applicableTo = ApplicableToEnum.CHANNEL;
  discount.position = PositionEnum.CUSTOMER_PRICE;
  discount.isActive = true;
  discount.priority = 1;
  //discount.discountRuleId = 1;
  /*  discount.quoteId = 1;*/
  //discount.visibleProductFieldId = 1;
  //discount.value = 0.1;
  return discount;
});
