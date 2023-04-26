import { PartialType } from '@nestjs/swagger';
import { QuoteApprovalQueueDto } from './oem-quote-approval-queue.dto';
import { QuoteApprovalQueue } from '../oem-quote-approval-queue.entity';

export class QuoteApprovalQueueSerializeDto extends PartialType(
  QuoteApprovalQueueDto,
) {
  constructor(data: Partial<QuoteApprovalQueue> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { QuoteApprovalQueueSerializeDto as OemQuoteApprovalQueueSerializeDto };
