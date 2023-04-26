import { OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { OemVendoApprovalQueueDto } from './oem-vendo-approval-queue.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class VendoApprovalQueueUpdateDto extends OmitType(
  OemVendoApprovalQueueDto,
  [
    'vendoApprovalQueueId',
    'companyId',
    'vendoId',
    'userId',
    'approvalQueuePriorityId',
    'token',
    'targetType',
    'isEnabled',
    'createdAt',
    'updatedAt',
    'company',
    'user',
    'vendo',
    'approvalQueuePriority',
  ],
) {
  @IsOptional()
  expiresAt: Date | string;
}

export { VendoApprovalQueueUpdateDto as OemVendoApprovalQueueUpdateDto };
