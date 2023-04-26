import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentTermEnum } from './oem-quotes-products.enums/payment-term.enum';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { OemQuoteEntity } from '../../main/oem-quotes/oem-quote.entity';
import { OemProductBaseEntity } from '../../main/oem-products/oem-product-base.entity';
import { OemBundleEntity } from '../../main/oem-bundles/oem-bundle.entity';
import { OemProductEntity } from '../../main/oem-products/oem-product.entity';
import { SfQuoteProductMetadataEntity } from '../../../shared/salesforce/salesforce.entities.metadata/quote-product.metadata.entity';

@Index('oem_quotes_products_company_id_idx', ['companyId'], {})
@Index('oem_quotes_products_product_id_idx', ['productId'], {})
@Index('oem_quotes_products_bundle_id_idx', ['bundleId'], {})
@Index('oem_quotes_products_quote_id_idx', ['quoteId'], {})
@Index('oem_quotes_products_pkey', ['quoteProductId'], {
  unique: true,
})
@Entity('oem_quotes_products', { schema: 'oem' })
export class QuotesProducts extends SfQuoteProductMetadataEntity {
  constructor(data: Partial<QuotesProducts> = {}) {
    super();
    Object.assign(this, data);
  }

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @PrimaryGeneratedColumn({ type: 'integer', name: 'quote_product_id' })
  quoteProductId: number;

  @Column({ type: 'integer', name: 'product_id', nullable: true })
  productId: number;

  @Column({ type: 'integer', name: 'bundle_id', nullable: true })
  bundleId: number;

  @Column({ type: 'integer', name: 'quote_id' })
  quoteId: number;

  @Column('timestamp with time zone', {
    name: 'end_date',
  })
  endDate: Date;

  @Column('timestamp with time zone', {
    name: 'start_date',
  })
  startDate: Date;

  @Column('numeric', {
    name: 'quantity',
    scale: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseInt(value);
      },
    },
  })
  quantity: number;

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

  @Column('jsonb', {
    name: 'invoice_schedule',
    default: () => "'[]'",
    nullable: false,
  })
  invoiceSchedule: object;

  @Column('enum', {
    name: 'payment_term',
    enum: PaymentTermEnum,
  })
  paymentTerm: PaymentTermEnum;

  @Column('boolean', { name: 'is_locked', default: false })
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

  @ManyToOne(
    () => OemProductEntity,
    (oemProductEntity) => oemProductEntity.quotesProducts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'productId' }])
  product: OemProductEntity;

  @ManyToOne(
    () => OemBundleEntity,
    (oemProductEntity) => oemProductEntity.quotesBundles,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'bundle_id', referencedColumnName: 'productId' }])
  bundle: OemBundleEntity;

  @ManyToOne(
    () => OemQuoteEntity,
    (oemQuoteEntity) => oemQuoteEntity.quotesProducts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'quote_id', referencedColumnName: 'quoteId' }])
  quote: OemProductEntity;
}

export { QuotesProducts as OemQuotesProducts };
