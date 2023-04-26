import { OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { OemQuoteApprovalQueueDto } from './oem-quote-approval-queue.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuoteApprovalQueueUpdateDto extends OmitType(
  OemQuoteApprovalQueueDto,
  [
    'quoteApprovalQueueId',
    'companyId',
    'quoteId',
    'userId',
    'approvalQueuePriorityId',
    'token',
    'targetType',
    'isEnabled',
    'createdAt',
    'updatedAt',
    'company',
    'user',
    'quote',
    'approvalQueuePriority',
  ],
) {
  @IsOptional()
  expiresAt: Date | string;
}

export { QuoteApprovalQueueUpdateDto as OemQuoteApprovalQueueUpdateDto };
