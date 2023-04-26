import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';

import { QuoteUserTypeEnum } from '../oem-quotes-external-users.enums/quote-user-type.enum';
import { OemQuoteEntity } from '../../../main/oem-quotes/oem-quote.entity';
import { OemUserEntity } from '../../../main/oem-users/oem-user.entity';
import { QuoteStatusEnum } from '../../../main/oem-quotes/oem-quote.enums/quote-status.enum';

export class QuotesUsersDto {
  /**
   * The id of Quote
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  quoteId: number;

  /**
   * The id of User
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
   * The type
   * @example End Customer
   */
  @IsEnum(QuoteUserTypeEnum)
  type: QuoteUserTypeEnum;

  /**
   * Is owner
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isOwner: boolean;

  //TODO: need to add a validator - ONLY 1 user can be eApprover
  /**
   * Is approver
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isApprover: boolean;

  /**
   * The approval status for saved alert
   * @example Pending
   */
  @IsEnum(QuoteStatusEnum)
  @IsOptional()
  approvalStatus: QuoteStatusEnum;

  /**
   * Is saved alert user
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isSavedAlertUser: boolean;

  /**
   * Is workflow user
   * @example false
   */
  @IsBoolean()
  @IsOptional()
  isWorkflowUser: boolean;

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
  createdAt: Date;

  /**
   * The date of updating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date;

  /**
   * The quote
   * @example Quote
   */
  quote: OemQuoteEntity;

  /**
   * The user
   * @example User
   */
  user: OemUserEntity;
}

export { QuotesUsersDto as OemQuotesUsersDto };
