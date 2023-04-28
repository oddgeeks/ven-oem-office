import { JobNames } from '../../../queues/queues.enums/queue-enum';

export class BaseEventHandlerCommand<T = any> {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly payload: T,
    public readonly deleted: boolean = false,
    public readonly jobName?: JobNames,
  ) {}
}
