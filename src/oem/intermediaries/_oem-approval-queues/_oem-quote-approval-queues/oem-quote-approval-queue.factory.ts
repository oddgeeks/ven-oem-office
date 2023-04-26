import { define } from 'typeorm-seeding';
import * as moment from 'moment-timezone';

import { QuoteApprovalQueue } from './oem-quote-approval-queue.entity';
import { QuoteApprovalQueueStatusEnum } from './oem-quote-approval-queue.enums/quote-approval-queue-status.enum';
import { QuoteApprovalQueueTargetTypeEnum } from './oem-quote-approval-queue.enums/quote-approval-queue-target-type.enum';

interface Context {
  companyId?: number;
  userId?: number;
  quoteId?: number;
  approvalQueuePriorityId?: number;
  token?: string;
  status?: QuoteApprovalQueueStatusEnum;
  expiresAt?: Date | string;
  targetType: QuoteApprovalQueueTargetTypeEnum;
}

define(QuoteApprovalQueue, (faker_, context: Context) => {
  const quoteApprovalQueue = new QuoteApprovalQueue();

  quoteApprovalQueue.companyId = context?.companyId || 1;
  quoteApprovalQueue.userId = context?.userId || 1;
  quoteApprovalQueue.quoteId = context?.quoteId || 1;
  quoteApprovalQueue.approvalQueuePriorityId =
    context?.approvalQueuePriorityId || 1;
  quoteApprovalQueue.token = context?.token;
  quoteApprovalQueue.status = context?.status;
  quoteApprovalQueue.targetType =
    context?.targetType || QuoteApprovalQueueTargetTypeEnum.INTERNAL;
  quoteApprovalQueue.expiresAt =
    (context?.expiresAt && new Date(context.expiresAt)) ||
    moment.utc().add(1, 'month').toDate();

  return quoteApprovalQueue;
});
