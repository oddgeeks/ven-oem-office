import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Validate,
} from 'class-validator';
import { IsDiscountHasSameType } from '../oem-discount-priorities.validators/oem-discount-priorities.validators';

export class DiscountPrioritiesDto {
  /**
   * The id of source discount
   * @example 1
   */
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
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @IsDefined()
  @Validate(IsDiscountHasSameType)
  targetDiscountId: number;
}

export { DiscountPrioritiesDto as OemDiscountPrioritiesDto };
