import { ProductEventHandler } from './product-event.handler';
import { QuoteEventHandler } from './quote-event.handler';

export const CommandHandlers = [QuoteEventHandler, ProductEventHandler];
