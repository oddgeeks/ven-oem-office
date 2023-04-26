import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OemContactEntity } from '../../main/oem-contacts/oem-contact.entity';
import { OemQuoteEntity } from '../../main/oem-quotes/oem-quote.entity';
import { TypeEnum } from './oem-quotes-contacts.enums/type.enum';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_quotes_contacts_contact_id_idx', ['contactId'], {})
@Index('oem_quotes_contacts_quote_id_idx', ['quoteId'], {})
@Entity('oem_quotes_contacts', { schema: 'oem' })
export class QuotesContacts {
  constructor(data: Partial<QuotesContacts> = {}) {
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

  @PrimaryColumn({ type: 'integer', name: 'contact_id' })
  contactId: number;

  @Column({
    type: 'character varying',
    name: 'sf_opportunity_contact_role_id',
    length: 36,
    nullable: true,
    default: null,
  })
  sfOpportunityContactRoleId: string | null;

  @Column('decimal', {
    name: 'position',
    precision: 3,
    scale: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  position: number;

  @Column('enum', {
    name: 'type',
    enum: TypeEnum,
  })
  type: TypeEnum;

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

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('boolean', { name: 'is_owner', default: false })
  isOwner: boolean;

  @ManyToOne(
    () => OemContactEntity,
    (oemContacts) => oemContacts.quotesContacts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'contact_id', referencedColumnName: 'contactId' }])
  contact: OemContactEntity;

  @ManyToOne(() => OemQuoteEntity, (oemQuotes) => oemQuotes.quotesContacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'quote_id', referencedColumnName: 'quoteId' }])
  quote: OemQuoteEntity;
}

export { QuotesContacts as OemQuotesContacts };
