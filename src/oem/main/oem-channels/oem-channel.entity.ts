import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { OemCompanyProgram } from '../../intermediaries/_oem-company-programs/oem-company-program.entity';
import { OemCompanyChannelSetting } from '../../intermediaries/_oem-company-channels-settings/oem-company-channel-setting.entity';
import { CompanyChannelAddressEntity } from '../../intermediaries/_oem-company-channel-addresses/oem-company-channel-addresses.entity';

@Index('oem_channels_pkey', ['channelId'], {
  unique: true,
})
@Index('oem_channels_is_active_idx', ['isActive'], {})
@Index('oem_channels_is_enabled_idx', ['isEnabled'], {})
@Entity('oem_channels', { schema: 'oem' })
export class ChannelEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'channel_id',
  })
  channelId: number;

  @Column('character varying', {
    name: 'logo_url',
    length: 1024,
    nullable: true,
    default: null,
  })
  logoUrl: string;

  @Column('character varying', {
    name: 'name',
    unique: true,
    length: 128,
  })
  name: string;

  @Column('character varying', {
    name: 'website',
    length: 256,
    nullable: true,
    default: null,
  })
  website: string;

  @Column('character varying', {
    name: 'contact_name',
    length: 128,
  })
  contactName: string;

  @Column('character varying', {
    name: 'contact_email',
    length: 256,
  })
  contactEmail: string;

  @Column('character varying', {
    name: 'contact_phone',
    length: 24,
    nullable: true,
    default: null,
  })
  contactPhone: string;

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

  @OneToMany(
    () => OemCompanyProgram,
    (companyPrograms) => companyPrograms.channel,
  )
  companyPrograms: OemCompanyProgram[];

  @OneToMany(
    () => OemCompanyChannelSetting,
    (companyChannels) => companyChannels.channel,
  )
  companyChannelSettings: OemCompanyChannelSetting[];

  @OneToMany(
    () => CompanyChannelAddressEntity,
    (oemCompanyChannelAddresses) => oemCompanyChannelAddresses,
  )
  companyChannelAddresses: CompanyChannelAddressEntity[];
}

export { ChannelEntity as OemChannelEntity };
