import { ProductEventHandler } from './product-event.handler';
import { QuoteEventHandler } from './quote-event.handler';
import { SessionLogoutEventHandler } from './session-logout-event.handler';

export const CommandHandlers = [
  QuoteEventHandler,
  ProductEventHandler,
  SessionLogoutEventHandler,
];
