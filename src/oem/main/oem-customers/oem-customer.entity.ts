import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { OemCustomersProducts } from '../../intermediaries/_oem-customers-products/oem-customers-products.entity';
import { OemNotification } from '../oem-notifications/oem-notification.entity';
import { OemQuoteEntity } from '../oem-quotes/oem-quote.entity';
import { OemVendoEntity } from '../oem-vendos/oem-vendo.entity';
import { OemCustomerAddresses } from '../../intermediaries/_oem-customer-addresses/oem-customer-addresses.entity';

// @Index('oem_customers_customer_email_key', ['customerEmail', 'companyId'], {
//   unique: true,
// })
@Index('oem_customers_pkey', ['customerId'], { unique: true })
@Index('oem_customers_licensing_program_id_idx', ['licensingProgramId'], {})
@Entity('oem_customers', { schema: 'oem' })
export class Customer {
  constructor(data: Partial<Customer> = {}) {
    Object.assign(this, data);
  }
  @PrimaryGeneratedColumn({ type: 'integer', name: 'customer_id' })
  customerId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({ type: 'integer', name: 'licensing_program_id' })
  licensingProgramId: number;

  @Column('character varying', {
    name: 'organization_id',
    nullable: true,
    length: 36,
  })
  organizationId: string | null;

  @Column('character varying', {
    name: 'sales_organization_id',
    nullable: true,
    length: 36,
  })
  salesOrganizationId: string | null;

  @Column('character varying', { name: 'customer_name', length: 128 })
  customerName: string;

  @Column('character varying', {
    name: 'industry',
    nullable: true,
    length: 128,
  })
  industry: string | null;

  @Column('character varying', {
    name: 'customer_email',
    // unique: true,
    length: 256,
    nullable: true,
  })
  customerEmail: string | null;

  @Column('character varying', {
    name: 'logo_url',
    nullable: true,
    length: 1024,
  })
  logoUrl: string | null;

  @Column('character varying', { name: 'phone', nullable: true, length: 36 })
  phone: string | null;

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

  @OneToMany(
    () => OemCustomersProducts,
    (oemCustomersProducts) => oemCustomersProducts.customer,
  )
  customersProducts: OemCustomersProducts[];

  @OneToMany(() => OemVendoEntity, (oemVendos) => oemVendos.customer)
  vendos: OemVendoEntity[];

  @OneToMany(() => OemQuoteEntity, (oemQuotes) => oemQuotes.customer)
  quotes: OemQuoteEntity[];

  @OneToMany(
    () => OemNotification,
    (oemNotifications) => oemNotifications.customer,
  )
  notifications: OemNotification[];

  @OneToMany(
    () => OemCustomerAddresses,
    (customerAddresses) => customerAddresses.customer,
  )
  customerAddresses: OemCustomerAddresses[];
}
export { Customer as OemCustomerEntity };
