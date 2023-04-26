import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { AddressTypeEnum } from '../oem-address.enums/address-type.enum';

export class OemAddressDto {
  /**
   * The id of Address
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  addressId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  companyId: number;

  /**
   * The address 1
   * @example VE, 32
   */
  @IsString()
  address_1: string | null;

  /**
   * The address 2
   * @example GU, 36
   */
  @IsString()
  address_2: string | null;

  /**
   * The address 3
   * @example BG, 38
   */
  @IsString()
  address_3: string | null;

  /**
   * The city
   * @example New York
   */
  @IsString()
  @IsNotEmpty()
  city: string;

  /**
   * The zip code
   * @example 32143
   */
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  /**
   * The state
   * @example Mexico
   */
  @IsString()
  @IsNotEmpty()
  region: string;

  /**
   * The state
   * @example Mexico
   */
  @IsString()
  @IsNotEmpty()
  country: string;

  /**
   * The state
   * @example +1 929 279-9165
   */
  @IsString()
  @IsNotEmpty()
  phone: string | null;

  /**
   * The email
   * @example example@example.com
   */
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string | null;

  /* /!**
    * Is this a shipping address? Required for customers and companies
    * @example true
    *!/
   @IsBoolean()
   isBilling: boolean;

   /!**
    * Is this a shipping address? Required for customers and companies
    * @example true
    *!/
   @IsBoolean()
   isShipping: boolean;
 */

  /**
   * Address type. Required for customers and companies
   * @example Shipping | Billing
   */
  @IsEnum(AddressTypeEnum)
  addressType: AddressTypeEnum;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * The date of creating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of updating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;
}
