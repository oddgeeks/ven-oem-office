import { OmitType } from '@nestjs/swagger';

import { OemApprovalQueuePriorityDto } from './oem-approval-queue-priority.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ApprovalQueuePriorityUpdateDto extends OmitType(
  OemApprovalQueuePriorityDto,
  [
    'approvalQueuePriorityId',
    'companyId',
    'roleId',
    'isEnabled',
    'createdAt',
    'updatedAt',
    'company',
    'role',
  ],
) {}

export { ApprovalQueuePriorityUpdateDto as OemApprovalQueuePriorityUpdateDto };
