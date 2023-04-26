import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { OemCustomersProducts } from '../_oem-customers-products/oem-customers-products.entity';
import { OemQuoteEntity } from '../../main/oem-quotes/oem-quote.entity';

@Index(
  'oem_quotes_customer_products_customer_product_id_idx',
  ['customerProductId'],
  {},
)
@Index('oem_quotes_customer_products_quote_id_idx', ['quoteId'], {})
@Index(
  'oem_quotes_customer_products_pkey',
  ['quoteCustomerProductId', 'companyId'],
  {
    unique: true,
  },
)
@Entity('oem_quotes_customer_products', { schema: 'oem' })
export class QuotesCustomerProducts {
  constructor(data: Partial<QuotesCustomerProducts> = {}) {
    Object.assign(this, data);
  }

  /*@Column('uuid')
  @PrimaryGeneratedColumn('uuid')*/

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'quote_customer_product_id',
  })
  quoteCustomerProductId: number;

  @Column({ type: 'integer', name: 'customer_product_id' })
  customerProductId: number;

  @Column({ type: 'integer', name: 'quote_id' })
  quoteId: number;

  @Column('character varying', {
    name: 'customer_product_uuid',
    nullable: true,
    unique: true,
    length: 36,
  })
  customerProductUuid: string | null;

  @Column('jsonb', {
    name: 'locked_fields',
    default: () => "'[]'",
    nullable: false,
  })
  lockedFields: object;

  @Column('boolean', { name: 'is_locked' })
  isLocked: boolean;

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

  @ManyToOne(() => OemQuoteEntity, (quote) => quote.quoteCustomerProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'quote_id', referencedColumnName: 'quoteId' }])
  quote: OemQuoteEntity;

  @ManyToOne(
    () => OemCustomersProducts,
    (oemCustomerProducts) => oemCustomerProducts.quoteCustomerProducts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'customer_product_id', referencedColumnName: 'customerProductId' },
  ])
  customerProduct: OemCustomersProducts;
}

export { QuotesCustomerProducts as OemQuotesCustomerProducts };
