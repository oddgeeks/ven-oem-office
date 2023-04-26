import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemApprovalQueuePriority } from '../../main/oem-approval-queue-priorities/oem-approval-queue-priority.entity';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateDemoOemApprovalQueuePriorities implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const approvalQueuePriorities: Partial<OemApprovalQueuePriority>[] = [
        {
          companyId,
          roleId: 11,
          priority: 7,
          isActive: true,
          isEnabled: true,
        },
        {
          companyId,
          roleId: 3,
          priority: 6,
          isActive: true,
          isEnabled: true,
        },
        {
          companyId,
          roleId: 2,
          priority: 5,
          isActive: true,
          isEnabled: true,
        },
        {
          companyId,
          roleId: 1,
          priority: 4,
          isActive: false,
          isEnabled: false,
        },
        {
          companyId,
          roleId: 10,
          priority: 3,
          isActive: true,
          isEnabled: true,
        },
        {
          companyId,
          roleId: 4,
          priority: 1,
          isActive: true,
          isEnabled: true,
        },
        {
          companyId,
          roleId: 5,
          priority: 2,
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
