import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { get } from 'lodash';
import { EventPayload } from '../../shared/event-handler/event.paylaod/event.payload';

export const EventDispatcher = <T>(eventKey: string, deleted = false) => {
  const injectEventService = Inject(EventEmitter2);
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    injectEventService(target, 'event');
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      // Need to parse args before applying the original method because it might be mutated inside the original method like logout.
      // TODO: I think passing 1 as a default value is not a good idea. Better to handle undefined id in even handlers.
      const recordId = get(args[0], 'parsed.paramsFilter[0].value', 1);
      const userId = get(args[0], 'user.userId');

      const data = await originalMethod.apply(this, args);
      // const request = args[1];
      const event: EventEmitter2 = this.event;
      event.emit(
        eventKey,
        new EventPayload<T>(recordId, userId, data, deleted),
      );
      return data;
    };
  };
};
