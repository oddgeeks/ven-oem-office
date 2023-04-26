import { OmitType } from '@nestjs/swagger';

import { OemApprovalQueuePriorityDto } from './oem-approval-queue-priority.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ApprovalQueuePriorityReplaceDto extends OmitType(
  OemApprovalQueuePriorityDto,
  [
    'approvalQueuePriorityId',
    'isEnabled',
    'createdAt',
    'updatedAt',
    'company',
    'companyId',
    'role',
  ],
) {}

export { ApprovalQueuePriorityReplaceDto as OemApprovalQueuePriorityReplaceDto };
