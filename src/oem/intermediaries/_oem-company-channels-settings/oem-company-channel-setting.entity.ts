import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { OemCompanyChannel } from '../../intermediaries/_oem-company-channels/oem-company-channel.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { OemChannelEntity } from '../../main/oem-channels/oem-channel.entity';

@Index('oem_company_channel_settings_pkey', ['companyChannelSettingId'], {
  unique: true,
})
@Index('oem_company_channel_settings_company_id_idx', ['companyId'], {})
@Index('oem_company_channel_settings_channel_id_idx', ['channelId'], {})
@Index('oem_company_channel_settings_is_enabled_idx', ['isEnabled'], {})
@Entity('oem_company_channel_settings', { schema: 'oem' })
export class CompanyChannelSetting {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'company_channel_setting_id',
  })
  companyChannelSettingId: number;

  @Column('character varying', {
    name: 'logo_url',
    length: 1024,
    nullable: true,
    default: null,
  })
  logoUrl: string;

  @Column({
    type: 'int',
    name: 'channel_id',
  })
  channelId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('character varying', {
    name: 'name',
    //unique: true,
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

  @OneToOne(
    () => OemCompanyChannel,
    (companyChannel) => companyChannel.companyChannelSetting,
  )
  companyChannel: OemCompanyChannel;

  @ManyToOne(
    () => OemChannelEntity,
    (oemChannel) => oemChannel.companyChannelSettings,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'channel_id', referencedColumnName: 'channelId' }])
  channel: OemChannelEntity;
}

export { CompanyChannelSetting as OemCompanyChannelSetting };
