import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

import { OemNotification } from './oem-notification.entity';
import { OemNotificationTypeEnum } from './oem-notification.enums/oem-notification.notification-type.enum';
import { IOemNotificationReqBody } from './oem-notification.type/oem-notification-req-body.type';

interface Context {
  companyId: number;
  senderId?: number;
  receiverId?: number;
  customerId?: number;
  quoteId?: number;
  vendoId?: number;
  fromEmail?: string;
  toEmail?: string;
  notificationType?: OemNotificationTypeEnum;
  subject?: string;
  metaData?: object;
  reqBody?: IOemNotificationReqBody[];
}

define(OemNotification, (faker_, context: Context) => {
  const notification: OemNotification = new OemNotification();

  notification.companyId = context?.companyId || 1;
  notification.senderId = context?.senderId || 1;
  notification.receiverId = context?.receiverId || 2;
  notification.customerId = context?.customerId || 1;
  notification.quoteId = context?.quoteId || 1;
  notification.vendoId = context?.vendoId || 1;
  notification.fromEmail = context?.fromEmail || faker.internet.email();
  notification.toEmail = context?.toEmail || faker.internet.email();
  notification.notificationType =
    context?.notificationType || OemNotificationTypeEnum.VENDO_SUBMITTED;
  notification.subject =
    context?.subject ||
    `${faker.name.firstName()} on ${faker.company.companySuffix()} needs your decision`;
  notification.metaData = context?.metaData || {
    test: 'test',
  };
  notification.reqBody = context?.reqBody || null;

  return notification;
});
