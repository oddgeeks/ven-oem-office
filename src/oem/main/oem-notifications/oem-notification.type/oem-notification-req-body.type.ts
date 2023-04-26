export class IOemNotificationReqBody {
  email?: string;
  timestamp?: number;
  'smtp-id'?: string;
  event?: string;
  sg_event_id?: string;
  sg_message_id?: string;
  response?: string;
}
