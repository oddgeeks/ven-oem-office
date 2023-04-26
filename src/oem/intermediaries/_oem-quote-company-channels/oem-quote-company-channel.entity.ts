import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { OemQuoteEntity } from '../../main/oem-quotes/oem-quote.entity';
import { OemCompanyChannel } from '../_oem-company-channels/oem-company-channel.entity';

@Index('oem_quote_company_channels_quote_id_idx', ['quoteId'], {})
@Index(
  'oem_quote_company_channels_company_channel_id_idx',
  ['companyChannelId'],
  {},
)
@Entity('oem_quote_company_channels', { schema: 'oem' })
export class QuoteCompanyChannel {
  @PrimaryColumn({ type: 'integer', name: 'quote_id' })
  quoteId: number;

  @PrimaryColumn({ type: 'integer', name: 'company_channel_id' })
  companyChannelId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @ManyToOne(() => OemQuoteEntity, (quote) => quote.quoteCompanyChannels, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'quote_id', referencedColumnName: 'quoteId' }])
  quote: OemQuoteEntity;

  @ManyToOne(
    () => OemCompanyChannel,
    (companyChannel) => companyChannel.quoteCompanyChannels,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'company_channel_id', referencedColumnName: 'companyChannelId' },
  ])
  companyChannel: OemCompanyChannel;
}

export { QuoteCompanyChannel as OemQuoteCompanyChannel };
