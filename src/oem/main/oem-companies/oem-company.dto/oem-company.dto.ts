import {
  IsString,
  MaxLength,
  IsNumber,
  IsUrl,
  IsEmail,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsBoolean,
  IsDate,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { PermitCreditCardsEnum } from '../oem-company.enums/permit-credit-cards.enum';
import { SettingsType } from '../oem-company.types/settings.type';
import { OemCompanyAddressesEntity } from '../../../intermediaries/_oem-company-addresses/oem-company-addresses.entity';

export class OemCompanyDto {
  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The name of Company
   * @example Rad
   */
  @IsString()
  @MaxLength(128)
  @IsNotEmpty()
  companyName: string;

  /**
   * The email of Company
   * @example rad@vendori.com
   */
  @IsEmail()
  @MaxLength(128)
  @IsNotEmpty()
  companyEmail: string;

  /**
   * The email of Company
   * @example "https://files.vendori.com/logo.png"
   */
  @IsUrl()
  @MaxLength(1024)
  logoUrl: string | null;

  /**
   * The website of Company
   * @example "https://company.vendori.com"
   */
  @ValidateIf((i) => i.websiteUrl !== '')
  @IsUrl()
  @MaxLength(1024)
  @IsOptional()
  websiteUrl: string | null;

  /**
   * The expiration of quote in days by default. Setting in Company Resources.
   * @example 4
   */
  @IsNumber()
  @IsNotEmpty()
  defaultQuoteExpiration: number | null;

  /**
   * The bank name for Company.
   * @example "Gold"
   */
  @IsString()
  @MaxLength(256)
  bankName: string | null;

  /**
   * The bank account number for Company.
   * @example "1234567891011121314151617"
   */
  @IsString()
  @MaxLength(36)
  bankAccountNumber: string | null;

  /**
   * The bank routing number for Company.
   * @example "123456789"
   */
  @IsString()
  @MaxLength(36)
  bankRoutingNumber: string | null;

  /**
   * The array of deal attributes for Company.
   * @example ["Net New", "Expansion", "Renewal", "Custom Billing", "Custom Discount"]
   */
  @IsArray()
  dealAttributes: string[];

  /**
   * The permission of using credit cards.
   * 'All Products', 'Designated Products Only', 'No'
   * @example 'All Products'
   */
  @IsEnum(PermitCreditCardsEnum)
  permitCreditCards: PermitCreditCardsEnum;

  /**
   * The settings type
   */
  @ApiProperty({
    type: SettingsType,
    default: {
      customListPriceName: 'List Price',
      customCustomerPriceName: 'Price To Customer',
      companyPrimaryColor: {
        r: 74,
        g: 137,
        b: 187,
        a: 1,
      },
      startingQuoteNumber: 1,
    },
  })
  @IsNotEmpty()
  @Type(() => SettingsType)
  settings: SettingsType;

  /**
   * The permission of signing.
   * @example true
   */
  @IsBoolean()
  isPermitSigning: boolean;

  /**
   * The phone number of User
   * @example "+1 929 279-9165"
   */
  //@IsPhoneNumber()
  @MaxLength(36)
  phone: string;

  /**
   * The address of Company.
   * @example CompanyAddress
   */
  @Type(() => OemCompanyAddressesEntity)
  companyAddress: OemCompanyAddressesEntity;

  /**
   * The all roles in Company.
   * @example []
   */
  @IsArray()
  roles: object[];

  /**
   * If current record is active.
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
