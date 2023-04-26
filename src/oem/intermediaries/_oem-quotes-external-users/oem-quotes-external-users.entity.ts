import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OemQuoteEntity } from '../../main/oem-quotes/oem-quote.entity';
import { OemUserEntity } from '../../main/oem-users/oem-user.entity';
import { QuoteUserTypeEnum } from './oem-quotes-external-users.enums/quote-user-type.enum';
import { QuoteStatusEnum } from '../../main/oem-quotes/oem-quote.enums/quote-status.enum';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { OemExternalUserEntity } from '../../main/oem-external-users/oem-external-user.entity';

@Index('oem_quotes_external_users_quote_id_idx', ['quoteId'], {})
@Index('oem_quotes_external_users_external_user_id_idx', ['externalUserId'], {})
@Index('oem_quotes_external_users_approval_status_idx', ['approvalStatus'], {})
@Index(
  'oem_quotes_external_users_is_saved_alert_user_idx',
  ['isSavedAlertUser'],
  {},
)
@Index('oem_quotes_external_users_is_workflow_user_idx', ['isWorkflowUser'], {})
@Entity('oem_quotes_external_users', { schema: 'oem' })
export class QuotesExternalUsers {
  constructor(data: Partial<QuotesExternalUsers> = {}) {
    Object.assign(this, data);
  }

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @PrimaryColumn({ type: 'integer', name: 'quote_id' })
  quoteId: number;

  @PrimaryColumn({ type: 'integer', name: 'external_user_id' })
  externalUserId: number;

  @Column('enum', {
    name: 'type',
    enum: QuoteUserTypeEnum,
  })
  type: QuoteUserTypeEnum;

  @Column('boolean', { name: 'is_owner', default: false })
  isOwner: boolean;

  @Column('boolean', { name: 'is_approver', default: false })
  isApprover: boolean;

  @Column('enum', {
    name: 'approval_status',
    enum: QuoteStatusEnum,
    nullable: true,
    default: null,
  })
  approvalStatus: QuoteStatusEnum;

  @Column('boolean', { name: 'is_saved_alert_user', default: false })
  isSavedAlertUser: boolean;

  @Column('boolean', { name: 'is_workflow_user', default: true })
  isWorkflowUser: boolean;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date | string;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date | string;

  @ManyToOne(
    () => OemQuoteEntity,
    (oemQuotes) => oemQuotes.externalUsersQuotes,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'quote_id', referencedColumnName: 'quoteId' }])
  quote: OemQuoteEntity;

  @ManyToOne(
    () => OemExternalUserEntity,
    (oemUsers) => oemUsers.externalUsersQuotes,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'external_user_id', referencedColumnName: 'externalUserId' },
  ])
  user: OemExternalUserEntity;
}

export { QuotesExternalUsers as OemQuotesExternalUsers };
