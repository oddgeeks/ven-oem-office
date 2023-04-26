import { define } from 'typeorm-seeding';
import * as moment from 'moment-timezone';

import { VendoApprovalQueue } from './oem-vendo-approval-queue.entity';
import { VendoApprovalQueueStatusEnum } from './oem-vendo-approval-queue.enums/vendo-approval-queue-status.enum';
import { VendoApprovalQueueTargetTypeEnum } from './oem-vendo-approval-queue.enums/vendo-approval-queue-target-type.enum';

interface Context {
  companyId?: number;
  userId?: number;
  vendoId?: number;
  approvalQueuePriorityId?: number;
  targetType: VendoApprovalQueueTargetTypeEnum;
  token?: string;
  status?: VendoApprovalQueueStatusEnum;
  expiresAt?: Date | string;
}

define(VendoApprovalQueue, (faker_, context: Context) => {
  const vendoApprovalQueue = new VendoApprovalQueue();

  vendoApprovalQueue.companyId = context?.companyId || 1;
  vendoApprovalQueue.userId = context?.userId || 1;
  vendoApprovalQueue.vendoId = context?.vendoId || 1;
  vendoApprovalQueue.approvalQueuePriorityId =
    context?.approvalQueuePriorityId || 1;
  vendoApprovalQueue.token = context?.token;
  vendoApprovalQueue.status = context?.status;
  vendoApprovalQueue.expiresAt =
    (context?.expiresAt && new Date(context.expiresAt)) ||
    moment.utc().add(1, 'month').toDate();
  vendoApprovalQueue.companyId = context?.companyId || 1;
  vendoApprovalQueue.targetType =
    context?.targetType || VendoApprovalQueueTargetTypeEnum.INTERNAL;

  return vendoApprovalQueue;
});
