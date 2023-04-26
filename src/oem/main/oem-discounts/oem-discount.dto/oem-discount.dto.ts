import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  IsPositive,
  IsInt,
  IsEnum,
} from 'class-validator';
import { DiscountTypeEnum } from '../oem-discount.enums/discount-type.enum';
import { ApplicableToEnum } from '../oem-discount.enums/applicable-to.enum';
import { PositionEnum } from '../oem-discount.enums/position.enum';

export class DiscountDto {
  /**
   * The id of Discount
   * @example 1
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  discountId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  companyId: number;

  /**
   * The discount type
   * @example Program
   */
  @IsEnum(DiscountTypeEnum)
  @IsNotEmpty()
  discountType: DiscountTypeEnum;

  /**
   * The applicable to
   * @example Channel
   */
  @IsEnum(ApplicableToEnum)
  @IsNotEmpty()
  applicableTo: ApplicableToEnum;

  /**
   * The position
   * @example List Price
   */
  @IsEnum(PositionEnum)
  @IsNotEmpty()
  position: PositionEnum;

  /**
   * The discount name
   * @example Name 1
   */
  @IsString()
  @IsOptional()
  name: string;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * Is active
   * @example true
   */
  @IsBoolean()
  isActive: boolean;

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

  /*  /!**
     * The id of DiscountRule
     * @example 1
     *!/
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    discountRuleId: number;*/

  /*  /!**
     * The id of Quote
     * @example 1
     *!/
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    quoteId: number;*/

  /*  /!**
     * The id of VisibleProductField
     * @example 1
     *!/
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    visibleProductFieldId: number;*/

  /*  /!**
     * The discount value
     * @example 0.1
     *!/
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    value: number;*/
}

export { DiscountDto as OemDiscountDto };
