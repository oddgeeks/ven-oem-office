import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

import { OemCompanyEntity } from '../../../main/oem-companies/oem-company.entity';
import { OemQuoteEntity } from '../../../main/oem-quotes/oem-quote.entity';
import { OemCompanyChannel } from '../../_oem-company-channels/oem-company-channel.entity';

export class QuoteCompanyChannelDto {
  /**
   * The id of Deal Partner
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of Quote
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  quoteId: number;

  /**
   * The id of Company Channel
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyChannelId: number;

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
   * The company
   * @example Company
   */
  @Type(() => OemCompanyEntity)
  company: OemCompanyEntity;

  /**
   * The quote
   * @example Quote
   */
  @Type(() => OemQuoteEntity)
  quote: OemQuoteEntity;

  /**
   * The company channel
   * @example CompanyChannel
   */
  @Type(() => OemCompanyChannel)
  companyChannel: OemCompanyChannel;
}

export { QuoteCompanyChannelDto as OemQuoteCompanyChannelDto };
