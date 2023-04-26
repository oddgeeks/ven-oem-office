import { IsNotEmpty, IsNumberString, Validate } from 'class-validator';
import { IsUserEnabled } from '../oem-external-user.validators/oem-external-user.validator';

export class OemExternalUserDeleteDto {
  /**
   * The id of Replaced User
   * @example 1
   */
  @IsNumberString()
  @IsNotEmpty()
  @Validate(IsUserEnabled)
  replaceUserId: number;
}
