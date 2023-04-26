import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  Validate,
} from 'class-validator';
import { IsUserEnabled } from '../oem-user.validators/oem-user.validator';

export class OemUserDeleteDto {
  /**
   * The id of Replaced User
   * @example 1
   */
  @IsNumberString()
  @IsNotEmpty()
  @Validate(IsUserEnabled)
  replaceUserId: number;
}
