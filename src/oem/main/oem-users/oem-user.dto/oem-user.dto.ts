import {
  IsString,
  MaxLength,
  IsNumber,
  IsUrl,
  IsEmail,
  IsNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  Validate,
  MinLength,
  Min,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

import { OemRoleEntity } from '../../oem-roles/oem-role.entity';
import { User } from '../oem-user.entity';
import { OemCompanyChannel } from '../../../intermediaries/_oem-company-channels/oem-company-channel.entity';

import { IsGeoHierarchy } from '../../oem-hierarchies/oem-hierarchy.validators/oem-hierarchy.validators';

import {
  IsPhoneAlreadyExist,
  IsUserEmailAlreadyExist,
} from '../oem-user.validators/oem-user.validator';

export class OemUserDto {
  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }
  /**
   * The id of User
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  userId: number;

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
  @IsOptional()
  companyOrganisationName: string | null;

  /**
   * The id of Role
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  roleId: number;

  /**
   * The id of Hierarchy
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Validate(IsGeoHierarchy)
  geoHierarchyId: number;

  /**
   * The id of Company Channel
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  companyChannelId: number;

  /**
   * The organization id of User
   * @example SF.129hfnf
   */
  @IsString()
  @MaxLength(24)
  @IsOptional()
  organizationId: string | null;

  /**
   * The pre populated fields for User
   * @example ["Full Name"]
   */
  @IsArray()
  @IsOptional()
  prePopulatedFields: string[] | null;

  /**
   * The image url for User avatar
   * @example http://images.vendori.com/file.png
   */
  @IsUrl()
  @MaxLength(1024)
  @IsOptional()
  imageUrl: string | null;

  /**
   * The first name of User
   * @example "John"
   */
  @Matches(/^[A-Za-z0-9\-\'\.]+$/, {
    message: `Value should contain alphanumeric characters and these three symbols - ' and .`,
  })
  @MaxLength(128)
  firstName: string;

  /**
   * The last name of User
   * @example "Strong"
   */
  @Matches(/^[A-Za-z0-9\-\'\.]+$/, {
    message: `Value should contain alphanumeric characters and these three symbols - ' and .`,
  })
  @MaxLength(128)
  lastName: string;

  /**
   * The email of User
   * @example john.smith@vendori.com
   */
  @MaxLength(256)
  @IsEmail()
  notificationEmail: string | null;

  /**
   * The email for login
   * @example john.smith@vendori.com
   */
  @MaxLength(256)
  @IsEmail()
  ssoLoginEmail: string;

  /**
   * The User password
   */
  @MinLength(8)
  @IsOptional()
  password: string;

  /**
   * The phone number of User
   * @example "+1 929 279-9165"
   */
  //@Validate(IsPhoneAlreadyExist)
  @MaxLength(36)
  phone: string;

  /**
   * The flag set true if user is from external organization
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  isExternal: boolean;

  /**
   * The user's region
   * @example "New York"
   */
  @IsString()
  @MaxLength(128)
  region: string;

  /**
   * The user's Time Zone Name
   * @example "US/Pacific"
   */
  @IsString()
  @MaxLength(48)
  timeZoneArea: string;

  /**
   * The flag set true if user has already viewed Welcome Text
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  isHideWelcomeText: boolean;

  /**
   * The flag set true if user is active
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

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

  /**
   * The role of users.
   * @example Role
   */
  role: OemRoleEntity;

  /**
   * The company channel.
   * @example CompanyChannel
   */
  @Type(() => OemCompanyChannel)
  companyChannel: OemCompanyChannel;
}
