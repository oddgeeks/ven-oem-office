import { PartialType } from '@nestjs/swagger';
import { OemApprovalQueuePriorityDto } from './oem-approval-queue-priority.dto';
import { ApprovalQueuePriority } from '../oem-approval-queue-priority.entity';

export class ApprovalQueuePrioritySerializeDto extends PartialType(
  OemApprovalQueuePriorityDto,
) {
  constructor(data: Partial<ApprovalQueuePriority> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { ApprovalQueuePrioritySerializeDto as OemApprovalQueuePrioritySerializeDto };
