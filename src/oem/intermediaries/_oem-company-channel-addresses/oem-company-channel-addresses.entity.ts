import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { OemCompanyEntity } from '../../main/oem-companies/oem-company.entity';
import { OemChannelEntity } from '../../main/oem-channels/oem-channel.entity';
import { OemAddressEntity } from '../../main/oem-addresses/oem-address.entity';
import { CompanyChannel } from '../_oem-company-channels/oem-company-channel.entity';

@Index('oem_company_channel_addresses_company_id_idx', ['companyId'], {})
@Index(
  'oem_company_channel_addresses_company_channel_id_idx',
  ['companyChannelId'],
  {},
)
@Index('oem_company_channel_addresses_address_id_idx', ['addressId'], {})
@Index('oem_company_channel_addresses_channel_id_idx', ['channelId'], {})
@Entity('oem_company_channel_addresses', { schema: 'oem' })
export class CompanyChannelAddressEntity {
  constructor(data: Partial<CompanyChannelAddressEntity> = {}) {
    Object.assign(this, data);
  }

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @PrimaryColumn({ type: 'integer', name: 'company_channel_id' })
  companyChannelId: number;

  @PrimaryColumn({ type: 'integer', name: 'channel_id' })
  channelId: number;

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

  @ManyToOne(() => OemCompanyEntity, (company) => company.companyChannels, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @OneToOne(
    () => OemAddressEntity,
    (address) => address.companyChannelAddress,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'address_id', referencedColumnName: 'addressId' }])
  address: OemAddressEntity;

  @ManyToOne(
    () => CompanyChannel,
    (companyChannel) => companyChannel.companyChannelAddresses,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'company_channel_id', referencedColumnName: 'companyChannelId' },
  ])
  companyChannel: CompanyChannel;

  @ManyToOne(
    () => OemChannelEntity,
    (channel) => channel.companyChannelAddresses,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'channel_id', referencedColumnName: 'channelId' }])
  channel: OemChannelEntity;
}

export { CompanyChannelAddressEntity as OemCompanyChannelAddresses };
