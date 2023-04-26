import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemApprovalQueuePriority } from '../../main/oem-approval-queue-priorities/oem-approval-queue-priority.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateCleanOemApprovalQueuePriorities implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const approvalQueuePriorities: Partial<OemApprovalQueuePriority>[] = [
        {
          companyId,
          roleId: 2,
          priority: 2,
          isActive: true,
          isEnabled: true,
        },
        {
          companyId,
          roleId: 3,
          priority: 3,
          isActive: true,
          isEnabled: true,
        },
      ];

      const approvalQueuePriorityEntities = await seedEntities(
        connection,
        OemApprovalQueuePriority,
        approvalQueuePriorities,
      );

      return approvalQueuePriorityEntities;
    }
  };
