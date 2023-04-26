import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './event.commands/handler';
import { EventHandlerService } from './event-handler.service';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [CqrsModule, QueuesModule],
  controllers: [],
  providers: [...CommandHandlers, EventHandlerService],
  exports: [],
})
export class EventHandlerModule {}
