import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OemCompanyAddressesEntity } from '../../intermediaries/_oem-company-addresses/oem-company-addresses.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { AddressTypeEnum } from './oem-address.enums/address-type.enum';
import { OemCustomerAddresses } from '../../intermediaries/_oem-customer-addresses/oem-customer-addresses.entity';
import { CompanyChannelAddressEntity } from '../../intermediaries/_oem-company-channel-addresses/oem-company-channel-addresses.entity';

@Index('oem_addresses_pkey', ['addressId'], { unique: true })
@Entity('oem_addresses', { schema: 'oem' })
export class Address {
  constructor(data: Partial<Address> = {}) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ type: 'integer', name: 'address_id' })
  addressId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('character varying', {
    name: 'address_1',
    nullable: true,
    length: 256,
    default: null,
  })
  address_1: string | null;

  @Column('character varying', {
    name: 'address_2',
    nullable: true,
    length: 256,
    default: null,
  })
  address_2: string | null;

  @Column('character varying', {
    name: 'address_3',
    nullable: true,
    length: 256,
    default: null,
  })
  address_3: string | null;

  @Column('character varying', { name: 'city', length: 128 })
  city: string;

  @Column('character varying', { name: 'zip_code', length: 24 })
  zipCode: string;

  @Column('character varying', { name: 'region', length: 128 })
  region: string;

  @Column('character varying', { name: 'country', length: 32 })
  country: string;

  @Column('character varying', { name: 'phone', nullable: true, length: 36 })
  phone: string | null;

  @Column('character varying', { name: 'email', nullable: true, length: 36 })
  email: string | null;

  /*@Column('boolean', { name: 'is_billing', default: false })
  isBilling: boolean;

  @Column('boolean', { name: 'is_shipping', default: false })
  isShipping: boolean;*/
  @Column('enum', {
    name: 'address_type',
    enum: AddressTypeEnum,
    default: AddressTypeEnum.BILLING,
  })
  addressType: AddressTypeEnum;

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

  @OneToMany(
    () => OemCompanyAddressesEntity,
    (oemCompanyAddresses) => oemCompanyAddresses.address,
  )
  companyAddresses: OemCompanyAddressesEntity[];

  @OneToMany(
    () => OemCustomerAddresses,
    (customerAddresses) => customerAddresses.address,
  )
  customerAddresses: OemCustomerAddresses[];

  @OneToOne(
    () => CompanyChannelAddressEntity,
    (oemCompanyChannelAddress) => oemCompanyChannelAddress.address,
  )
  companyChannelAddress: CompanyChannelAddressEntity;
}

export { Address as OemAddressEntity };
