import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  IsEmail,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Notification } from '../oem-notification.entity';
import { Company } from '../../oem-companies/oem-company.entity';
import { User } from '../../oem-users/oem-user.entity';
import { Customer } from '../../oem-customers/oem-customer.entity';
import { OemNotificationTypeEnum } from '../oem-notification.enums/oem-notification.notification-type.enum';
import { IOemNotificationReqBody } from '../oem-notification.type/oem-notification-req-body.type';
import { OemQuoteApprovalQueue } from '../../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { OemVendoApprovalQueue } from '../../../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';
import { OemQuoteEntity } from '../../oem-quotes/oem-quote.entity';
import { OemVendoEntity } from '../../oem-vendos/oem-vendo.entity';

export class NotificationDto {
  constructor(data: Partial<Notification> = {}) {
    Object.assign(this, data);
  }

  /**
   * The id of Notification
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  notificationId: number;

  /**
   * The id of Сompany
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of User sending an email
   * @example 1
   */
  @IsNumber()
  senderId: number;

  /**
   * The id of User receiving an email
   * @example 2
   */
  @IsNumber()
  receiverId: number;

  /**
   * The id of Customer
   * @example 1
   */
  @IsNumber()
  customerId: number;

  /**
   * The id of UserCustomAlert
   * @example 1
   */
  @IsNumber()
  userCustomAlertId: number;

  /**
   * The id of CompanyAlert
   * @example 1
   */
  @IsNumber()
  companyAlertId: number;

  /**
   * The id of Quote
   * @example 1
   */
  @IsNumber()
  quoteId: number;

  /**
   * The id of Vendor
   * @example 1
   */
  @IsNumber()
  vendoId: number;

  /**
   * The id of QuoteApprovalQueue
   * @example 1
   */
  @IsNumber()
  quoteApprovalQueueId: number;

  /**
   * The id of VendoApprovalQueue
   * @example 1
   */
  @IsNumber()
  vendoApprovalQueueId: number;

  /**
   * The From Email Adress
   * @example example_from@example.com
   */
  @IsEmail()
  @MaxLength(256)
  fromEmail: string;

  /**
   * The To Email Address
   * @example example_to@example.com
   */
  @IsEmail()
  @MaxLength(256)
  toEmail: string;

  /**
   * The Notification Type
   * @example Vendo Approved
   */
  @IsEnum(OemNotificationTypeEnum)
  notificationType: OemNotificationTypeEnum;

  /**
   * The Subject
   * @example John on Quote 1 needs your decision
   */
  @IsString()
  @MaxLength(256)
  subject: string;

  /**
   * The date of sending an email
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  sentAt: Date;

  /**
   * The date of sending a batched email
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  batchedAt: Date;

  /**
   * Is read
   * @example true
   */
  @IsBoolean()
  isRead: boolean;

  /**
   * The Email Status
   * @example delivered
   */
  @IsString()
  @MaxLength(256)
  status: string;

  /**
   * The id of SendGrid Message
   * @example NkEazxssQsutOSeQc8fTPw
   */
  @IsString()
  @MaxLength(256)
  messageId: string;

  /**
   * The SendGrid configuration
   * @example {subject: 'test'}
   */
  @IsObject()
  @IsNotEmpty()
  metaData: object;

  /**
   * The SendGrid callback request body
   * @example [{email: 'example@test.com'}]
   */
  @IsArray()
  @Type(() => IOemNotificationReqBody)
  reqBody: IOemNotificationReqBody[];

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * The date of creating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date;

  /**
   * The date of updating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date;

  /**
   * The company
   * @example CompanyEntity
   */
  @Type(() => Company)
  company: Company;

  /**
   * The sending user
   * @example User
   */
  @Type(() => User)
  sender: User;

  /**
   * The receiving user
   * @example User
   */
  @Type(() => User)
  receiver: User;

  /**
   * The customer
   * @example Customer
   */
  @Type(() => Customer)
  customer: Customer;

  /**
   * The quote approval queue
   * @example QuoteApprovalQueue
   */
  @Type(() => OemQuoteApprovalQueue)
  quoteApprovalQueue: OemQuoteApprovalQueue;

  /**
   * The vendo approval queue
   * @example VendoApprovalQueue
   */
  @Type(() => OemVendoApprovalQueue)
  vendoApprovalQueue: OemVendoApprovalQueue;

  /**
   * The quote
   * @example Quote
   */
  @Type(() => OemQuoteEntity)
  quote: OemQuoteEntity;

  /**
   * The vendo
   * @example Vendo
   */
  @Type(() => OemVendoEntity)
  vendo: OemVendoEntity;
}

export { NotificationDto as OemNotificationDto };
