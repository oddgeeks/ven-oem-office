import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QueuesService } from '../../../queues/queues.service';
import { BaseEventHandlerCommand } from '../impl/base-event-handler.command';
import { JobNames } from '../../../../shared/queues/queues.enums/queue-enum';

@CommandHandler(BaseEventHandlerCommand)
export class EventHandler implements ICommandHandler<BaseEventHandlerCommand> {
  constructor(private readonly queueService: QueuesService) {}

  async execute(command: BaseEventHandlerCommand) {
    const { id, payload, deleted } = command;
    await this.queueService.addRealtimeSyncToSF(
      JobNames.RealTimeSyncProductToSF,
      id,
      payload,
      deleted,
    );
  }
}
