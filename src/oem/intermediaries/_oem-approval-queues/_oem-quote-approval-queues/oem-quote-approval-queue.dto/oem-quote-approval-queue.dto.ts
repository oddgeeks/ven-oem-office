import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { Exclude } from 'class-transformer';

import { QuoteApprovalQueueStatusEnum } from '../oem-quote-approval-queue.enums/quote-approval-queue-status.enum';
import { QuoteApprovalQueueTargetTypeEnum } from '../oem-quote-approval-queue.enums/quote-approval-queue-target-type.enum';
import { OemCompanyEntity } from '../../../../main/oem-companies/oem-company.entity';
import { OemUserEntity } from '../../../../main/oem-users/oem-user.entity';
import { OemQuoteEntity } from '../../../../main/oem-quotes/oem-quote.entity';
import { OemApprovalQueuePriority } from '../../../../main/oem-approval-queue-priorities/oem-approval-queue-priority.entity';

export class QuoteApprovalQueueDto {
  /**
   * The id of Quote Approval Queue
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  quoteApprovalQueueId: number;

  /**
   * The id of Company
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
   * The id of User
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  userId: number;

  /**
   * The id of Approval Queue Priority
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  approvalQueuePriorityId: number;

  /**
   * The token
   * @example token_string
   */
  @IsString()
  @Exclude()
  token: string;

  /**
   * The status
   * @example Approved
   */
  @IsEnum(QuoteApprovalQueueStatusEnum)
  @IsOptional()
  status: QuoteApprovalQueueStatusEnum;

  /**
   * The target type
   * @example User
   */
  @IsEnum(QuoteApprovalQueueTargetTypeEnum)
  @IsOptional()
  targetType: QuoteApprovalQueueTargetTypeEnum;

  /**
   * Is active
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  /**
   * The date of token expiration.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsOptional()
  expiresAt: Date | string;

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
   * The company
   * @example Company
   */
  company: OemCompanyEntity;

  /**
   * The user
   * @example User
   */
  user: OemUserEntity;

  /**
   * The quote
   * @example Quote
   */
  quote: OemQuoteEntity;

  /**
   * The approval queue priority
   * @example ApprovalQueuePriority
   */
  approvalQueuePriority: OemApprovalQueuePriority;
}

export { QuoteApprovalQueueDto as OemQuoteApprovalQueueDto };
