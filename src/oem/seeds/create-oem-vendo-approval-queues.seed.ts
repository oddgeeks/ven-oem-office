import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { VendoApprovalQueue } from '../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';

export default class CreateOemVendoApprovalQueues implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    return factory(VendoApprovalQueue)().create();
  }
}
