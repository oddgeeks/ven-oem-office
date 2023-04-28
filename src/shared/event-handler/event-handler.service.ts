import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
// import { OemQuoteEventsEnum } from '../../../oem/main/oem-quotes/oem-quote.events/oem-quote.events.enum';
import { EventPayload } from './event.paylaod/event.payload';
import { QuoteEventHandlerCommand } from './event.commands/impl/quote-event-handler.command';
import { EventsEnum } from './event.enum/events.enum';
import { ProductEventHandlerCommand } from './event.commands/impl/product-event-handler.command';
import { JobNames } from '../queues/queues.enums/queue-enum';
import { SessionLogoutEventHandlerCommand } from './event.commands/impl/session-logout-event-handler.command';

@Injectable()
export class EventHandlerService {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent(EventsEnum.QUOTE_CHANGED)
  async quoteEventListener(payload: EventPayload) {
    const id = payload.id ?? payload.payload['quoteId'];
    if (!id) return;
    this.commandBus.execute(
      new QuoteEventHandlerCommand(id, payload.userId, payload.payload),
    );
  }

  @OnEvent(EventsEnum.QUOTE_TRANSACTED)
  async quoteTransactedEventListener(payload: EventPayload) {
    const id = payload.id ?? payload.payload['quoteId'];
    if (!id) return;
    this.commandBus.execute(
      new QuoteEventHandlerCommand(
        id,
        payload.userId,
        payload.payload,
        false,
        JobNames.CreateAssetToSF,
      ),
    );
  }

  @OnEvent(EventsEnum.QUOTE_PRODUCT_CHANGED)
  async quoteProductEventListener(payload: EventPayload) {
    // Get quote information
    const quoteProduct = payload.payload;
    this.commandBus.execute(
      new QuoteEventHandlerCommand(
        quoteProduct.quoteId,
        payload.userId,
        quoteProduct,
      ),
    );
  }

  @OnEvent(EventsEnum.PRODUCT_CHANGED)
  async ProductEventListener(payload: EventPayload) {
    const id = payload.id ?? payload.payload['productId'];
    if (!id) return;
    this.commandBus.execute(
      new ProductEventHandlerCommand(
        payload.id,
        payload.payload,
        payload.deleted,
      ),
    );
  }

  @OnEvent(EventsEnum.SESSION_LOGOUT)
  async SessionLogoutEventListener(payload: EventPayload) {
    this.commandBus.execute(
      new SessionLogoutEventHandlerCommand(
        payload.id,
        payload.userId,
        payload.payload,
      ),
    );
  }
}
