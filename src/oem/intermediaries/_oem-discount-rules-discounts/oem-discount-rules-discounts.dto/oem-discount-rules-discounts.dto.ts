import { IsInt, IsNotEmpty, IsPositive, Validate } from 'class-validator';
import { IsDiscountProgram } from '../oem-discount-rules-discounts.validators/oem-discount-rules-discounts.validators';

export class DiscountRulesDiscountsDto {
  /**
   * The id of Discount
   * @example 1
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Validate(IsDiscountProgram)
  discountId: number;

  /**
   * The id of DiscountRule
   * @example 1
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  discountRuleId: number;
}

export { DiscountRulesDiscountsDto as OemDiscountRulesDiscountsDto };
