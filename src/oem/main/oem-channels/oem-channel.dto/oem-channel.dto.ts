import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsArray,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import { OemCompanyProgram } from '../../../intermediaries/_oem-company-programs/oem-company-program.entity';
import { OemCompanyChannel } from '../../../intermediaries/_oem-company-channels/oem-company-channel.entity';

export class ChannelDto {
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
   * Is active
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

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
   * The company program
   * @example []
   */
  @IsArray()
  @Type(() => OemCompanyProgram)
  companyPrograms: OemCompanyProgram[];

  /**
   * The company channel
   * @example []
   */
  @IsArray()
  @Type(() => OemCompanyChannel)
  companyChannels: OemCompanyChannel[];
}

export { ChannelDto as OemChannelDto };
