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
import { OemCompanyEntity } from '../../main/oem-companies/oem-company.entity';
import { OemCustomerEntity } from '../../main/oem-customers/oem-customer.entity';
import { OemAddressEntity } from '../../main/oem-addresses/oem-address.entity';

@Index('oem_customer_addresses_company_id_idx', ['companyId'], {})
@Index('oem_customer_addresses_address_id_idx', ['addressId'], {})
@Index('oem_customer_addresses_customer_id_idx', ['customerId'], {})
@Entity('oem_customer_addresses', { schema: 'oem' })
export class CustomerAddresses {
  constructor(data: Partial<CustomerAddresses> = {}) {
    Object.assign(this, data);
  }

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @PrimaryColumn({ type: 'integer', name: 'customer_id' })
  customerId: number;

  @PrimaryColumn({ type: 'integer', name: 'address_id' })
  addressId: number;

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

  @ManyToOne(() => OemCompanyEntity, (company) => company.customerAddresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @ManyToOne(() => OemAddressEntity, (address) => address.customerAddresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'address_id', referencedColumnName: 'addressId' }])
  address: OemAddressEntity;

  @ManyToOne(
    () => OemCustomerEntity,
    (customer) => customer.customerAddresses,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'customer_id', referencedColumnName: 'customerId' }])
  customer: OemCustomerEntity;
}

export { CustomerAddresses as OemCustomerAddresses };
