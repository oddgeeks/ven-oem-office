import { ApiProperty } from '@nestjs/swagger';

import { QuoteStatusEnum } from '../oem-quote.enums/quote-status.enum';
import { DealTypeEnum } from '../oem-quote.enums/deal-type.enum';
import {
  IQuoteAttributes,
  QuoteAttributes,
} from '../oem-quote.interfaces/quote-attributes.interface';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IQuoteInternalCommentFiles,
  QuoteInternalCommentFiles,
} from '../oem-quote.interfaces/quote-internal-comment-files.interface';
import { IsGeoHierarchy } from '../../oem-hierarchies/oem-hierarchy.validators/oem-hierarchy.validators';
import { PIN_CODE_LENGTH } from '../oem-quote.entity';
import {
  IQuoteCommentSettings,
  QuoteCommentSettings,
} from '../oem-quote.interfaces/quote-comment-settings.interface';
import { SfQuoteMetadataDto } from '../../../../shared/salesforce/salesforce.dto.metadata/quote.metadata.dto';

export class QuoteDto extends SfQuoteMetadataDto {
  /**
   * The id of Quote
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  quoteId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of the Owner
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  ownerUserId: number;

  /**
   * The id of Customer
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  customerId: number;

  /**
   * The pincode
   * @example 3YU878
   */
  @IsString()
  @IsOptional()
  @MaxLength(PIN_CODE_LENGTH)
  @MinLength(PIN_CODE_LENGTH)
  pinCode: string;

  /**
   * The id of Geo Hierarchy
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Validate(IsGeoHierarchy)
  geoHierarchyId: number;

  /**
   * The uuid of Quote
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  //@IsUUID()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(36)
  quoteUuid: string;

  /**
   * The quote name
   * @example VE-1
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  quoteName: string;

  /**
   * The quote name
   * @example 100
   */
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  netAmount: number;

  /**
   * The quote status
   * @example Draft
   */
  @IsString()
  @IsEnum(QuoteStatusEnum)
  @IsOptional()
  quoteStatus: QuoteStatusEnum;

  /**
   * The quote status
   * @example Direct
   */
  @IsString()
  @IsNotEmpty()
  @IsEnum(DealTypeEnum)
  dealType: DealTypeEnum;

  /**
   * The currency
   * @example USD
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  currency: string;

  /**
   * The comments
   * @example Check payment
   */
  @IsString()
  @IsOptional()
  quoteComments: string;

  /**
   * The internal comments
   * @example plz, check payment
   */
  @IsString()
  @IsOptional()
  quoteInternalComments: string;

  /**
   * The internal comments file
   */
  @ApiProperty({
    type: [QuoteInternalCommentFiles],
    default: [
      {
        name: 'test',
        url: 'https://files.vendori.com/file.pdf',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => QuoteInternalCommentFiles)
  quoteInternalCommentFiles: IQuoteInternalCommentFiles[];

  /**
   * The quote attributes
   */
  @ApiProperty({
    type: [QuoteAttributes],
    default: [
      {
        name: 'test',
        value: 'test',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => QuoteAttributes)
  quoteAttributes: IQuoteAttributes[];

  /**
   * The quote setting comment
   */
  @ApiProperty({
    type: [QuoteCommentSettings],
    default: {
      quoteDefaultComment:
        'This Quote is Valid Until {{expiresAt}}. “Pending” quotes require internal review before approval.',
      consumptionMessage:
        'Quoted consumption offerings do not reflect contractually agreed upon delivery or invoice schedules. Displayed pricing is reflective of implied consumption rates and may change depending on product pricing.',
    },
  })
  @IsOptional()
  @Type(() => QuoteCommentSettings)
  quoteCommentSettings: IQuoteCommentSettings;

  /**
   * The pdf file
   * @example https://files.vendori.com/file.pdf
   */
  @IsString()
  @IsUrl()
  @MaxLength(256)
  @IsOptional()
  pdfFileUrl: string | null;

  /**
   * The excel file
   * @example https://files.vendori.com/file.excel
   */
  @IsString()
  @IsUrl()
  @MaxLength(256)
  @IsOptional()
  excelFileURL: string | null;

  /**
   * If accepting credit cards
   * @example true
   */
  @IsBoolean()
  isAcceptingCreditCard: boolean;
  /**
   * If requiring signing
   * @example true
   */
  @IsBoolean()
  isRequiringSigning: boolean;

  /**
   * If black box
   * @example true
   */
  @IsBoolean()
  isBlackBox: boolean;

  /**
   * If locked box
   * @example true
   */
  @IsBoolean()
  isLocked: boolean;

  /**
   * If enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * Is external
   * @example true
   */
  @IsBoolean()
  isExternal: boolean;

  /**
   * Is distributor visible
   */
  @IsBoolean()
  isDistributorVisible: boolean;

  /**
   * Is reseller visible
   */
  @IsBoolean()
  isResellerVisible: boolean;

  /**
   * Is hide schedule invoice from external
   */
  @IsBoolean()
  isExternalHideInvoice: boolean;

  /**
   * Is hide unit economics from external
   */
  @IsBoolean()
  isExternalHideUnit: boolean;

  /**
   * Is hide contacts from external
   */
  @IsBoolean()
  isExternalHideContact: boolean;

  /**
   * Quote expiration
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsOptional()
  expiresAt: Date | string;

  /**
   * Quote submitted date
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsOptional()
  submittedAt: Date | string;

  /**
   * Quote days since submission
   * @example "30 day(s)"
   */
  @IsString()
  daysSinceSubmission: string;

  /**
   * The locked fields
   * @example { Test: 'test' }
   */
  @IsObject()
  @IsNotEmpty()
  @IsOptional()
  lockedFields: object;

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
