import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OemCustomerEntity } from '../../main/oem-customers/oem-customer.entity';
import { OemProductEntity } from '../../main/oem-products/oem-product.entity';
import { OemQuotesCustomerProducts } from '../_oem-quotes-customer-products/oem-quotes-customer-products.entity';
import { OemBundleEntity } from '../../main/oem-bundles/oem-bundle.entity';
import { SfCustomerProductMetadataEntity } from '../../../shared/salesforce/salesforce.entities.metadata/customer-product.metadata.entity';

@Index('oem_customers_products_customer_id_idx', ['customerId'], {})
@Index('oem_customers_products_product_id_idx', ['productId'], {})
@Index('oem_customers_products_bundle_id_idx', ['bundleId'], {})
@Index('oem_customers_products_pkey', ['customerProductId'], { unique: true }) //-- why no unique?
@Entity('oem_customers_products', { schema: 'oem' })
export class CustomersProducts extends SfCustomerProductMetadataEntity {
  constructor(data: Partial<CustomersProducts> = {}) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ type: 'integer', name: 'customer_product_id' })
  customerProductId: number;

  @Column({ type: 'integer', name: 'product_id', nullable: true })
  productId: number;

  @Column({ type: 'integer', name: 'bundle_id', nullable: true })
  bundleId: number;

  @Column({ type: 'integer', name: 'customer_id' })
  customerId: number;

  /* @Column('character varying', {
     name: 'quote_uuid',
     nullable: true,
     unique: true,
     length: 36,
   })
   productUuid: string | null;*/

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

  @Column('timestamptz', {
    name: 'end_date',
  })
  endDate: Date;

  @Column('numeric', {
    name: 'customerPrice',
    default: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  customerPrice: number;

  @Column('numeric', {
    name: 'netPrice',
    default: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  netPrice: number;

  @ManyToOne(
    () => OemCustomerEntity,
    (oemCustomers) => oemCustomers.customersProducts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'customer_id', referencedColumnName: 'customerId' }])
  customer: OemCustomerEntity;

  @ManyToOne(
    () => OemProductEntity,
    (oemProducts) => oemProducts.customersProducts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'productId' }])
  product: OemProductEntity;

  @ManyToOne(
    () => OemBundleEntity,
    (oemProducts) => oemProducts.customersBundles,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'bundle_id', referencedColumnName: 'productId' }])
  bundle: OemBundleEntity;

  @OneToMany(
    () => OemQuotesCustomerProducts,
    (oemQuotesProducts) => oemQuotesProducts.customerProduct,
  )
  quoteCustomerProducts: OemQuotesCustomerProducts[];
}

export { CustomersProducts as OemCustomersProducts };
