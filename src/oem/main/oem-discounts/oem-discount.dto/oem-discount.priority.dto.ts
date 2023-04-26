import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Validate,
} from 'class-validator';
import { IsDiscountHasSameType } from '../../../intermediaries/_oem-discount-priorities/oem-discount-priorities.validators/oem-discount-priorities.validators';

export class DiscountPriorityDto {
  /**
   * The id of source discount
   * @example 1
   */
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @IsDefined()
  @Validate(IsDiscountHasSameType)
  sourceDiscountId: number;

  /**
   * The id of target discount
   * @example 1
   */
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @IsDefined()
  @Validate(IsDiscountHasSameType)
  targetDiscountId: number;
}

export { DiscountPriorityDto as OemDiscountPriorityDto };
