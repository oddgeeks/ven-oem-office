import {
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsBoolean,
  IsDate,
  Min,
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
} from 'class-validator';

import { UuidTypesEnum } from '../oem-quote-and-vendo.enums/uuid-types.enum';
import { OemCompanyEntity } from '../../../main/oem-companies/oem-company.entity';
import { QuoteAndVendoUuuidLastUuidValidator } from '../oem-quote-and-vendo-uuid.validators/quote-and-vendo-uuid-lastUuid.validator';

export class QuoteAndVendoUuidDto {
  /**
   * The id of QuoteAndVendoUuid
   * @example Quote
   */
  @IsEnum(UuidTypesEnum)
  @IsNotEmpty()
  quoteAndVendoUuidType: UuidTypesEnum;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The prefix
   * @example Q-
   */
  @IsString()
  @IsOptional()
  prefix: string;

  /**
   * The last uuid
   * @example 1
   */
  @IsPositive()
  @IsInt()
  @Min(1)
  @IsOptional()
  @QuoteAndVendoUuuidLastUuidValidator()
  lastUuid: number;

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
  company: OemCompanyEntity;
}

export { QuoteAndVendoUuidDto as OemQuoteAndVendoUuidDto };
