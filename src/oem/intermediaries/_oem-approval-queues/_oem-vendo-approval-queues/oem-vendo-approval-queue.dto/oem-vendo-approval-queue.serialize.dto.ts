import { PartialType } from '@nestjs/swagger';
import { VendoApprovalQueueDto } from './oem-vendo-approval-queue.dto';
import { VendoApprovalQueue } from '../oem-vendo-approval-queue.entity';

export class VendoApprovalQueueSerializeDto extends PartialType(
  VendoApprovalQueueDto,
) {
  constructor(data: Partial<VendoApprovalQueue> = {}) {
    super();

    Object.assign(this, data);
  }
}

export { VendoApprovalQueueSerializeDto as OemVendoApprovalQueueSerializeDto };
