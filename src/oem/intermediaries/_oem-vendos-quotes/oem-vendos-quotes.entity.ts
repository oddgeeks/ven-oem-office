import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OemQuoteEntity } from '../../main/oem-quotes/oem-quote.entity';
import { OemVendoEntity } from '../../main/oem-vendos/oem-vendo.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_vendos_quotes_quote_id_idx', ['quoteId'], {})
@Index('oem_vendos_quotes_vendo_id_idx', ['vendoId'], {})
@Entity('oem_vendos_quotes', { schema: 'oem' })
export class VendosQuotes {
  @PrimaryColumn({ type: 'integer', name: 'vendo_id' })
  vendoId: number;

  @PrimaryColumn({ type: 'integer', name: 'quote_id' })
  quoteId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date | string;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('boolean', { name: 'is_locked', default: false })
  isLocked: boolean;

  @Column({
    type: 'jsonb',
    nullable: false,
    default: () => "'[]'",
    name: 'locked_fields',
  })
  lockedFields: object;

  @ManyToOne(() => OemQuoteEntity, (oemQuotes) => oemQuotes.vendosQuotes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'quote_id', referencedColumnName: 'quoteId' }])
  quote: OemQuoteEntity;

  @ManyToOne(() => OemVendoEntity, (oemVendos) => oemVendos.vendosQuotes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'vendo_id', referencedColumnName: 'vendoId' }])
  vendo: OemVendoEntity;
}

export { VendosQuotes as OemVendosQuotes };
