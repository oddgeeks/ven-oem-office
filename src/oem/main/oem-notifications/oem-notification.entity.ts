import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OemNotificationTypeEnum } from './oem-notification.enums/oem-notification.notification-type.enum';
import { OemCompanyEntity } from '../oem-companies/oem-company.entity';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { OemCustomerEntity } from '../oem-customers/oem-customer.entity';
import { IOemNotificationReqBody } from './oem-notification.type/oem-notification-req-body.type';
import { OemQuoteApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { OemVendoApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';
import { OemQuoteEntity } from '../oem-quotes/oem-quote.entity';
import { OemVendoEntity } from '../oem-vendos/oem-vendo.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_notifications_pkey', ['notificationId'], {
  unique: true,
})
@Index('oem_notifications_company_id_idx', ['companyId'], {})
@Index('oem_notifications_sender_id_idx', ['senderId'], {})
@Index('oem_notifications_receiver_id_idx', ['receiverId'], {})
@Index('oem_notifications_customer_id_idx', ['customerId'], {})
@Index('oem_notifications_quote_id_idx', ['quoteId'], {})
@Index('oem_notifications_vendo_id_idx', ['vendoId'], {})
@Index('oem_notifications_status_idx', ['status'], {})
@Index('oem_notifications_notification_type_idx', ['notificationType'], {})
@Entity('oem_notifications', { schema: 'oem' })
export class Notification {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'notification_id' })
  notificationId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({
    type: 'integer',
    name: 'sender_id',
    nullable: true,
    default: null,
  })
  senderId: number;

  //TODO it is not clear that receiverId attached to userId
  @Column({
    type: 'integer',
    name: 'receiver_id',
    nullable: true,
    default: null,
  })
  receiverId: number;

  @Column({
    type: 'integer',
    name: 'customer_id',
    nullable: true,
    default: null,
  })
  customerId: number;

  @Column({
    type: 'integer',
    name: 'user_custom_alert_id',
    nullable: true,
    default: null,
  })
  userCustomAlertId: number;

  @Column({
    type: 'integer',
    name: 'company_alert_id',
    nullable: true,
    default: null,
  })
  companyAlertId: number;

  @Column({ type: 'integer', name: 'quote_id', nullable: true, default: null })
  quoteId: number;

  @Column({ type: 'integer', name: 'vendo_id', nullable: true, default: null })
  vendoId: number;

  @Column({
    type: 'integer',
    name: 'quote_approval_queue_id',
    nullable: true,
    default: null,
  })
  quoteApprovalQueueId: number;

  @Column({
    type: 'integer',
    name: 'vendo_approval_queue_id',
    nullable: true,
    default: null,
  })
  vendoApprovalQueueId: number;

  @Column('character varying', { name: 'from_email', length: 256 })
  fromEmail: string;

  @Column('character varying', { name: 'to_email', length: 256 })
  toEmail: string;

  @Column('enum', {
    name: 'notification_type',
    enum: OemNotificationTypeEnum,
  })
  notificationType: OemNotificationTypeEnum;

  @Column('character varying', {
    name: 'subject',
    length: 256,
    nullable: true,
    default: null,
  })
  subject: string;

  @Column('timestamp with time zone', {
    name: 'sent_at',
    nullable: true,
    default: null,
  })
  sentAt: Date;

  @Column('timestamp with time zone', {
    name: 'batched_at',
    nullable: true,
    default: null,
  })
  batchedAt: Date;

  @Column('boolean', { name: 'is_read', default: false })
  isRead: boolean;

  @Column('character varying', {
    name: 'status',
    length: 256,
    default: 'requested',
  })
  status: string;

  @Column('character varying', {
    name: 'message_id',
    length: 256,
    nullable: true,
    default: null,
  })
  messageId: string;

  @Column('jsonb', { name: 'meta_data', nullable: true, default: null })
  metaData: object;

  @Column('jsonb', {
    name: 'req_body',
    array: true,
    nullable: true,
    default: null,
  })
  reqBody: IOemNotificationReqBody[];

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @ManyToOne(() => OemCompanyEntity, (oemCompany) => oemCompany.notifications, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @ManyToOne(() => OemUserEntity, (oemUser) => oemUser.senderNotifications, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'sender_id', referencedColumnName: 'userId' }])
  sender: OemUserEntity;

  @ManyToOne(() => OemUserEntity, (oemUser) => oemUser.receiverNotifications, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'receiver_id', referencedColumnName: 'userId' }])
  receiver: OemUserEntity;

  @ManyToOne(
    () => OemCustomerEntity,
    (oemCustomer) => oemCustomer.notifications,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'customer_id', referencedColumnName: 'customerId' }])
  customer: OemCustomerEntity;

  @ManyToOne(
    () => OemQuoteApprovalQueue,
    (quoteApprovalQueue) => quoteApprovalQueue.notifications,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn([
    {
      name: 'quote_approval_queue_id',
      referencedColumnName: 'quoteApprovalQueueId',
    },
  ])
  quoteApprovalQueue: OemQuoteApprovalQueue;

  @ManyToOne(
    () => OemVendoApprovalQueue,
    (vendoApprovalQueue) => vendoApprovalQueue.notifications,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn([
    {
      name: 'vendo_approval_queue_id',
      referencedColumnName: 'vendoApprovalQueueId',
    },
  ])
  vendoApprovalQueue: OemVendoApprovalQueue;

  @ManyToOne(() => OemQuoteEntity, (quote) => quote.notifications, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([
    {
      name: 'quote_id',
      referencedColumnName: 'quoteId',
    },
  ])
  quote: OemQuoteEntity;

  @ManyToOne(() => OemVendoEntity, (vendo) => vendo.notifications, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([
    {
      name: 'vendo_id',
      referencedColumnName: 'vendoId',
    },
  ])
  vendo: OemVendoEntity;
}

export { Notification as OemNotification };
