import { OmitType } from '@nestjs/swagger';
import { OemQuoteApprovalQueueDto } from './oem-quote-approval-queue.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class QuoteApprovalQueueCreateDto extends OmitType(
  OemQuoteApprovalQueueDto,
  [
    'quoteApprovalQueueId',
    'approvalQueuePriorityId',
    'token',
    'isEnabled',
    'createdAt',
    'updatedAt',
    'company',
    'user',
    'quote',
    'approvalQueuePriority',
  ],
) {}

export { QuoteApprovalQueueCreateDto as OemQuoteApprovalQueueCreateDto };
