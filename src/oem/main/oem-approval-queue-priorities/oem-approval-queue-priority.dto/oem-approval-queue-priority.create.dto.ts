import { OmitType } from '@nestjs/swagger';
import { OemApprovalQueuePriorityDto } from './oem-approval-queue-priority.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ApprovalQueuePriorityCreateDto extends OmitType(
  OemApprovalQueuePriorityDto,
  [
    'approvalQueuePriorityId',
    'isEnabled',
    'createdAt',
    'updatedAt',
    'company',
    'role',
  ],
) {}

export { ApprovalQueuePriorityCreateDto as OemApprovalQueuePriorityCreateDto };
