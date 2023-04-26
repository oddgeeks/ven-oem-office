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

import { OemCompanyEntity } from '../../../main/oem-companies/oem-company.entity';
import { OemChannelEntity } from '../../../main/oem-channels/oem-channel.entity';
import { OemCompanyChannel } from '../../_oem-company-channels/oem-company-channel.entity';

export class CompanyProgramDto {
  /**
   * The id of Company Program
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyProgramId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of Channel
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  channelId: number;

  /**
   * The name
   * @example NA
   */
  @IsString()
  @MaxLength(128)
  name: string;

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
   * The company
   * @example Company
   */
  @Type(() => OemCompanyEntity)
  company: OemCompanyEntity;

  /**
   * The channel
   * @example Channel
   */
  @Type(() => OemChannelEntity)
  channel: OemChannelEntity;

  /**
   * The company channel
   * @example CompanyChannel
   */
  @Type(() => OemCompanyChannel)
  companyChannel: OemCompanyChannel;
}

export { CompanyProgramDto as OemCompanyProgramDto };
