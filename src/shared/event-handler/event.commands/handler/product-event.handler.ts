import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProductEventHandlerCommand } from '../impl/product-event-handler.command';
import { QueuesService } from '../../../../shared/queues/queues.service';
import { JobNames } from '../../../../shared/queues/queues.enums/queue-enum';

@CommandHandler(ProductEventHandlerCommand)
export class ProductEventHandler
  implements ICommandHandler<ProductEventHandlerCommand>
{
  constructor(private readonly queueService: QueuesService) {}

  async execute(command: ProductEventHandlerCommand) {
    const { id, payload, deleted } = command;
    await this.queueService.addRealtimeSyncToSF(
      JobNames.RealTimeSyncProductToSF,
      id,
      payload,
      deleted,
    );
  }
}
