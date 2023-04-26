import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { QuoteApprovalQueue } from '../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';

export default class CreateOemQuoteApprovalQueues implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    return factory(QuoteApprovalQueue)().create();
  }
}
