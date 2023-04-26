import {
  IsString,
  MaxLength,
  IsNumber,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsDate,
  IsAlpha,
} from 'class-validator';

import { ExternalUser } from '../oem-external-user.entity';

export class OemExternalUserDto {
  constructor(data: Partial<ExternalUser> = {}) {
    Object.assign(this, data);
  }
  /**
   * The id of External User
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  externalUserId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The name of Company to which contact is to be made
   * @example VDF-43
   */
  @IsString()
  @MaxLength(64)
  companyOrganisationName: string;

  /**
   * The first name of User
   * @example "John"
   */
  @IsAlpha()
  @MaxLength(128)
  firstName: string;

  /**
   * The last name of User
   * @example "Strong"
   */
  @IsAlpha()
  @MaxLength(128)
  lastName: string;

  /**
   * The email of User
   * @example john.smith@vendori.com
   */
  @MaxLength(256)
  @IsEmail()
  email: string;

  /**
   * The phone number of User
   * @example "+1 929 279-9165"
   */
  //@IsPhoneNumber()
  @MaxLength(36)
  phone: string;

  /**
   * The flag set true if user is enabled
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  isEnabled: boolean;

  /**
   * The date of creating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date;

  /**
   * The date of updating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date;
}
