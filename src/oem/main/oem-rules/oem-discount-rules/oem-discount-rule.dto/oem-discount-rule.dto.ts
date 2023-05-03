import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsPositive,
  IsInt,
  IsEnum,
  IsOptional, Validate,
} from 'class-validator';
import { DiscountRuleLogicType } from '../oem-discount-rule.types/discount-rule-logic.type';
import { DiscountRuleTypeEnum } from '../oem-discount-rule.enums/discount-rule.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDiscountRuleExists } from '../oem-discount-rule.validators/is-discount-rule-exists.validator';

export class DiscountRuleDto {
  /**
   * The id of DiscountRule
   * @example 1
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  discountRuleId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of Owner User
   * @example 1
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  ownerUserId: number;

  /**
   * The discount rule name
   * @example Discount Rule 1
   */
  @IsString()
  @MaxLength(256)
  @IsNotEmpty()
  @Transform(({ value }) => {
    return String(value)?.trim();
  })
  //@Validate(IsDiscountRuleExists)
  discountRuleName: string;

  /**
   * The Discount Rule Logic
   **/
  @ApiProperty({
    type: Object,
    default: {
      antecedent: [
        {
          type: 'AND',
          pre_quantifier: 'If a quote being created',
          predicate: 'Was sold by',
          post_quantifier: 'the following Sales Team',
        },
        {
          type: 'AND',
          pre_quantifier: 'Geo Hierarchy',
          predicate: 'Not Equal to',
          post_quantifier: '10%',
        },
      ],
      consequent: [
        {
          operation: 'Apply a discount',
          predicate: 0.1,
          post_quantifier: [1, 2, 3, 4, 5],
        },
      ],
    },
  })
  @Type(() => DiscountRuleLogicType)
  @IsNotEmpty()
  discountRuleLogic: DiscountRuleLogicType;

  /**
   * The discount rule type
   * @example Customer
   */
  @IsEnum(DiscountRuleTypeEnum)
  @IsNotEmpty()
  discountRuleType: DiscountRuleTypeEnum;

  /**
   * The starting date of the rule for filtering
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsOptional()
  startDate: Date | string;

  /**
   * The ending date of the rule for filtering
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsOptional()
  endDate: Date | string;

  /**
   * Is active
   * @example true
   */
  @IsBoolean()
  isActive: boolean;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * The date of creating.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of updating.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;
}

export { DiscountRuleDto as OemDiscountRuleDto };
