import { OmitType } from '@nestjs/swagger';
import { OemVendoApprovalQueueDto } from './oem-vendo-approval-queue.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class VendoApprovalQueueCreateDto extends OmitType(
  OemVendoApprovalQueueDto,
  [
    'vendoApprovalQueueId',
    'approvalQueuePriorityId',
    'token',
    'isEnabled',
    'createdAt',
    'updatedAt',
    'company',
    'user',
    'vendo',
    'approvalQueuePriority',
  ],
) {}

export { VendoApprovalQueueCreateDto as OemVendoApprovalQueueCreateDto };
