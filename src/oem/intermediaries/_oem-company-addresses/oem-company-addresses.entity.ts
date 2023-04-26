import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { OemAddressEntity } from '../../main/oem-addresses/oem-address.entity';
import { OemCompanyEntity } from '../../main/oem-companies/oem-company.entity';

@Index('oem_company_addresses_address_id_idx', ['addressId'], {})
@Index('oem_company_addresses_company_id_idx', ['companyId'], {})
@Entity('oem_company_addresses', { schema: 'oem' })
export class CompanyAddresses {
  constructor(data: Partial<CompanyAddresses> = {}) {
    Object.assign(this, data);
  }
  @PrimaryColumn({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @PrimaryColumn({ type: 'integer', name: 'address_id' })
  addressId: number;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date | string;

  @ManyToOne(
    () => OemAddressEntity,
    (oemAddresses) => oemAddresses.companyAddresses,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'address_id', referencedColumnName: 'addressId' }])
  address: OemAddressEntity;

  @OneToOne(
    () => OemCompanyEntity,
    (oemCompanies) => oemCompanies.companyAddress,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;
}

export { CompanyAddresses as OemCompanyAddressesEntity };
