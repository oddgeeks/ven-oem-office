export class EventPayload<T = any> {
  id?: number;
  payload?: T;
  deleted?: boolean;

  constructor(id?: number, payload?: T, deleted?: boolean) {
    this.id = id;
    this.payload = payload;
    this.deleted = deleted;
  }
}
