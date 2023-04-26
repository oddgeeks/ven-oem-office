import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuoteEventHandlerCommand } from '../impl/quote-event-handler.command';
import { QueuesService } from '../../../../shared/queues/queues.service';
import { JobNames } from '../../../../shared/queues/queues.enums/queue-enum';

@CommandHandler(QuoteEventHandlerCommand)
export class QuoteEventHandler
  implements ICommandHandler<QuoteEventHandlerCommand>
{
  constructor(private readonly queueService: QueuesService) {}

  async execute(command: QuoteEventHandlerCommand) {
    const { id, payload, deleted, jobName } = command;
    await this.queueService.addRealtimeSyncToSF(
      jobName ?? JobNames.RealTimeSyncQuoteToSF,
      id,
      payload,
      deleted,
    );
  }
}
