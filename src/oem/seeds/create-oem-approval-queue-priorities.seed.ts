import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { ApprovalQueuePriority } from '../main/oem-approval-queue-priorities/oem-approval-queue-priority.entity';

export default class CreateOemApprovalQueuePriorities implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // await factory(ApprovalQueuePriority)({
    //   companyId: 1,
    //   roleId: 1,
    // }).create();

    await factory(ApprovalQueuePriority)({
      approvalPriorityId: 2,
      companyId: 1,
      roleId: 2,
    }).create({
      approvalQueuePriorityId: 1,
    });

    // await factory(ApprovalQueuePriority)({
    //   companyId: 1,
    //   roleId: 3,
    // }).create();

    // return await factory(ApprovalQueuePriority)({
    //   companyId: 1,
    //   roleId: 4,
    // }).create({ approvalQueuePriorityId: 4 });

    return await factory(ApprovalQueuePriority)({
      companyId: 1,
      roleId: 5,
    }).create({
      approvalQueuePriorityId: 2,
    });
  }
}
