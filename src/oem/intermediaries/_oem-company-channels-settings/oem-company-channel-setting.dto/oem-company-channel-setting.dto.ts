import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OemCompanyChannel } from '../../../intermediaries/_oem-company-channels/oem-company-channel.entity';
import { OemChannelEntity } from '../../../main/oem-channels/oem-channel.entity';

export class CompanyChannelSettingDto {
  /**
   * The id of Channel Setting
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyChannelSettingId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  companyId: number;

  /**
   * The id of Channel
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  channelId: number;

  /**
   * The logo url
   */
  @IsString()
  @MaxLength(1024)
  @IsOptional()
  logoUrl: string;

  /**
   * The name
   * @example Internation Integration Manager
   */
  @IsString()
  @MaxLength(128)
  name: string;

  /**
   * The website
   * @example https://test.abc.com
   */
  @IsString()
  @MaxLength(256)
  @IsOptional()
  website: string;

  /**
   * The contact name
   * @example John Doe
   */
  @IsString()
  @MaxLength(128)
  contactName: string;

  /**
   * The contact email
   * @example johndoe+1@test.com
   */
  @IsString()
  @MaxLength(256)
  contactEmail: string;

  /**
   * The contact phone
   * @example +12345678901
   */
  @IsString()
  @MaxLength(24)
  @IsOptional()
  contactPhone: string;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  @IsOptional()
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
   * The company channel
   * @example Company Channel
   */
  @Type(() => OemCompanyChannel)
  companyChannel: OemCompanyChannel;

  /**
   * The company channel
   * @example Company Channel
   */
  @Type(() => OemChannelEntity)
  channel: OemChannelEntity;
}

export { CompanyChannelSettingDto as OemCompanyChannelSettingDto };
