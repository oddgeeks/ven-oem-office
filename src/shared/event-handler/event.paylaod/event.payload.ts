export class EventPayload<T = any> {
  constructor(
    public readonly id?: number,
    // authorized user id
    public readonly userId?: number,
    public readonly payload?: T,
    public readonly deleted?: boolean,
  ) {}
}
