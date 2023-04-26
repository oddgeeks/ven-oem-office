import { define } from 'typeorm-seeding';
import { ApprovalQueuePriority } from './oem-approval-queue-priority.entity';

interface Context {
  companyId: number;
  roleId?: number;
  priority?: number;
}

define(ApprovalQueuePriority, (faker_, context: Context) => {
  const approvalQueuePriority = new ApprovalQueuePriority();

  approvalQueuePriority.companyId = context?.companyId || 1;
  approvalQueuePriority.roleId = context?.roleId || 1;
  approvalQueuePriority.priority = context?.priority;

  return approvalQueuePriority;
});
