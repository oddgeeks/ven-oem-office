import { OemVendoApprovalQueueSerializeDto } from './oem-vendo-approval-queue.serialize.dto';
import { OemVendoApprovalQueueCreateDto } from './oem-vendo-approval-queue.create.dto';
import { OemVendoApprovalQueueUpdateDto } from './oem-vendo-approval-queue.update.dto';
import { OemVendoApprovalQueueReplaceDto } from './oem-vendo-approval-queue.replace.dto';

export const dto = {
  create: OemVendoApprovalQueueCreateDto,
  update: OemVendoApprovalQueueUpdateDto,
  replace: OemVendoApprovalQueueReplaceDto,
};

export const serialize = {
  get: OemVendoApprovalQueueSerializeDto,
  many: OemVendoApprovalQueueSerializeDto,
};
