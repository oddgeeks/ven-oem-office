import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UuidTypesEnum } from './oem-quote-and-vendo.enums/uuid-types.enum';
import { OemCompanyEntity } from '../../main/oem-companies/oem-company.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index(
  'oem_quote_and_vendo_uuid_pkey',
  ['quoteAndVendoUuidType', 'companyId'],
  {
    unique: true,
  },
)
@Index('oem_quote_and_vendo_uuid_company_id_idx', ['companyId'], {})
@Index('oem_quote_and_vendo_uuid_last_uuid_idx', ['lastUuid'], {})
@Entity('oem_quote_and_vendo_uuids', { schema: 'oem' })
export class QuoteAndVendoUuid {
  @PrimaryColumn({
    type: 'enum',
    name: 'quote_and_vendo_uuid_type',
    enum: UuidTypesEnum,
    default: UuidTypesEnum.QUOTE,
  })
  quoteAndVendoUuidType: UuidTypesEnum;

  /**
   * 23.03.23 Fixed issue, we should not allow use company_id without current_setting, otherwise it would broke tenancy
   */
  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({ type: 'character varying', name: 'prefix', default: 'Q-' })
  prefix: string;

  @Column({ type: 'integer', name: 'last_uuid', default: 1 })
  lastUuid: number;

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

  @ManyToOne(() => OemCompanyEntity, (company) => company.quoteAndVendoUuids, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  get uuid() {
    return `${this.prefix}${this.lastUuid}`;
  }
}

export { QuoteAndVendoUuid as OemQuoteAndVendoUuid };
