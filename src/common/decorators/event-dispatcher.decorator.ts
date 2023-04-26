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
      const data = await originalMethod.apply(this, args);
      // const request = args[1];
      const recordId = get(args[0], 'parsed.paramsFilter[0].value', 1);
      const event: EventEmitter2 = this.event;
      event.emit(eventKey, new EventPayload<T>(recordId, data, deleted));
      return data;
    };
  };
};
