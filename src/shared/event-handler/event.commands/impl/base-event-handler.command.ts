import { JobNames } from '@src/shared/queues/queues.enums/queue-enum';

export class BaseEventHandlerCommand<T = any> {
  constructor(
    public readonly id: number,
    public readonly payload: T,
    public readonly deleted: boolean = false,
    public readonly jobName?: JobNames,
  ) {}
}
