import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { QuoteApprovalQueueStatusEnum } from './oem-quote-approval-queue.enums/quote-approval-queue-status.enum';
import { QuoteApprovalQueueTargetTypeEnum } from './oem-quote-approval-queue.enums/quote-approval-queue-target-type.enum';
import { OemCompanyEntity } from '../../../main/oem-companies/oem-company.entity';
import { OemUserEntity } from '../../../main/oem-users/oem-user.entity';
import { OemQuoteEntity } from '../../../main/oem-quotes/oem-quote.entity';
import { OemApprovalQueuePriority } from '../../../main/oem-approval-queue-priorities/oem-approval-queue-priority.entity';
import { OemNotification } from '../../../main/oem-notifications/oem-notification.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../../environments';

@Index('oem_quote_approval_queues_pkey', ['quoteApprovalQueueId'], {
  unique: true,
})
@Index('oem_quote_approval_queues_company_id_idx', ['companyId'], {})
@Index('oem_quote_approval_queues_user_id_idx', ['userId'], {})
@Index('oem_quote_approval_queues_quote_id_idx', ['quoteId'], {})
@Index('oem_quote_approval_queues_token_idx', ['token'], {})
@Index(
  'oem_quote_approval_queues_priority_id_idx',
  ['approvalQueuePriorityId'],
  {},
)
@Entity('oem_quote_approval_queues', { schema: 'oem' })
//TODO: need to add validation only 1 active customer should be in approval queue
export class QuoteApprovalQueue {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'quote_approval_queue_id',
  })
  quoteApprovalQueueId: number;

  @Column({ type: 'integer', name: 'user_id', nullable: true, default: null })
  userId: number;

  @Column({ type: 'integer', name: 'quote_id' })
  quoteId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({
    type: 'integer',
    name: 'approval_queue_priority_id',
    nullable: true,
    default: null,
  })
  approvalQueuePriorityId: number;

  @Column('character varying', {
    name: 'token',
    length: 256,
    nullable: true,
    default: null,
  })
  token: string;

  @Column('enum', {
    name: 'status',
    enum: QuoteApprovalQueueStatusEnum,
    default: QuoteApprovalQueueStatusEnum.PENDING,
  })
  status: QuoteApprovalQueueStatusEnum;

  @Column('enum', {
    name: 'target_type',
    enum: QuoteApprovalQueueTargetTypeEnum,
    default: QuoteApprovalQueueTargetTypeEnum.USER, //TODO: I think we should change it bc we have ONLY [INTERNAL, EXTERNAL, CUSTOMER]
  })
  targetType: QuoteApprovalQueueTargetTypeEnum;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('timestamp with time zone', {
    name: 'expires_at',
    nullable: true,
    default: null,
  })
  expiresAt: Date | string;

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

  @ManyToOne(() => OemCompanyEntity, (company) => company.quoteApprovalQueues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @ManyToOne(() => OemUserEntity, (user) => user.quoteApprovalQueues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: OemUserEntity;

  @ManyToOne(() => OemQuoteEntity, (quote) => quote.quoteApprovalQueues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'quote_id', referencedColumnName: 'quoteId' }])
  quote: OemQuoteEntity;

  @ManyToOne(
    () => OemApprovalQueuePriority,
    (approvalQueuePriority) => approvalQueuePriority.quoteApprovalQueues,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'approval_queue_priority_id',
      referencedColumnName: 'approvalQueuePriorityId',
    },
  ])
  approvalQueuePriority: OemApprovalQueuePriority;

  @OneToMany(
    () => OemNotification,
    (oemNotifications) => oemNotifications.quoteApprovalQueue,
  )
  notifications: OemNotification[];
}

export { QuoteApprovalQueue as OemQuoteApprovalQueue };
