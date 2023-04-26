import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OemQuoteEntity } from '../../main/oem-quotes/oem-quote.entity';
import { OemVendoEntity } from '../../main/oem-vendos/oem-vendo.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_users_viewed_vendos_quotes_user_id_idx', ['userId'], {})
@Index('oem_users_viewed_vendos_quotes_vendo_id_idx', ['vendoId'], {})
@Index('oem_users_viewed_vendos_quotes_quote_id_idx', ['quoteId'], {})
@Entity('oem_users_viewed_vendos_quotes', { schema: 'oem' })
export class RecentlyViewedQuotesVendos {
  constructor(data: Partial<RecentlyViewedQuotesVendos> = {}) {
    Object.assign(this, data);
  }

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @PrimaryGeneratedColumn({ type: 'integer', name: 'recently_viewed_id' })
  recentlyViewedId: number;

  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column({ type: 'integer', name: 'vendo_id', nullable: true })
  vendoId: number | null;

  @Column({ type: 'integer', name: 'quote_id', nullable: true })
  quoteId: number | null;

  @ManyToOne(() => OemQuoteEntity, (quote) => quote.recentlyViewedQuotes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'quote_id', referencedColumnName: 'quoteId' }])
  quote: OemQuoteEntity;

  @ManyToOne(() => OemVendoEntity, (vendo) => vendo.recentlyViewedVendos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'vendo_id', referencedColumnName: 'vendoId' }])
  vendo: OemVendoEntity;

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
}

export { RecentlyViewedQuotesVendos as OemRecentlyViewedQuotesVendos };
