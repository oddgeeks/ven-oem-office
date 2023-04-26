import { OemQuoteApprovalQueueSerializeDto } from './oem-quote-approval-queue.serialize.dto';
import { OemQuoteApprovalQueueCreateDto } from './oem-quote-approval-queue.create.dto';
import { OemQuoteApprovalQueueUpdateDto } from './oem-quote-approval-queue.update.dto';
import { OemQuoteApprovalQueueReplaceDto } from './oem-quote-approval-queue.replace.dto';

export const dto = {
  create: OemQuoteApprovalQueueCreateDto,
  update: OemQuoteApprovalQueueUpdateDto,
  replace: OemQuoteApprovalQueueReplaceDto,
};

export const serialize = {
  get: OemQuoteApprovalQueueSerializeDto,
  many: OemQuoteApprovalQueueSerializeDto,
};
