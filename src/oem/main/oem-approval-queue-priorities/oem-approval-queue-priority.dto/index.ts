import { OemApprovalQueuePrioritySerializeDto } from './oem-approval-queue-priority.serialize.dto';
import { OemApprovalQueuePriorityCreateDto } from './oem-approval-queue-priority.create.dto';
import { OemApprovalQueuePriorityReplaceDto } from './oem-approval-queue-priority.replace.dto';
import { OemApprovalQueuePriorityUpdateDto } from './oem-approval-queue-priority.update.dto';

export const dto = {
  update: OemApprovalQueuePriorityUpdateDto,
  replace: OemApprovalQueuePriorityReplaceDto,
  create: OemApprovalQueuePriorityCreateDto,
};

export const serialize = {
  get: OemApprovalQueuePrioritySerializeDto,
  many: OemApprovalQueuePrioritySerializeDto,
};
