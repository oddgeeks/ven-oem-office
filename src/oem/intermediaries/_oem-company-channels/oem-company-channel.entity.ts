import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { ChannelTypeEnum } from './oem-company-channel.enums/channel-type.enum';
import { OemCompanyEntity } from '../../main/oem-companies/oem-company.entity';
import { OemHierarchyEntity } from '../../main/oem-hierarchies/oem-hierarchy.entity';
import { OemCompanyProgram } from '../_oem-company-programs/oem-company-program.entity';
import { OemUserEntity } from '../../main/oem-users/oem-user.entity';
import { OemQuoteCompanyChannel } from '../_oem-quote-company-channels/oem-quote-company-channel.entity';
import { OemLicensingProgramEntity } from '../../main/oem-licensing-programs/oem-licensing-program.entity';
import { OemCompanyChannelSetting } from '../_oem-company-channels-settings/oem-company-channel-setting.entity';
import { CompanyChannelAddressEntity } from '../_oem-company-channel-addresses/oem-company-channel-addresses.entity';

@Index('oem_company_channels_pkey', ['companyChannelId'], {
  unique: true,
})
@Index('oem_company_channels_company_id_idx', ['companyId'], {})
@Index(
  'oem_company_channels_company_channel_setting_id_idx',
  ['companyChannelSettingId'],
  {},
)
/*@Index('oem_company_channels_channel_id_idx', ['channelId'], {})*/
@Index('oem_company_channels_geo_hierarchy_id_idx', ['geoHierarchyId'], {})
@Index('oem_company_channels_company_program_id_idx', ['companyProgramId'], {})
@Index(
  'oem_company_channels_licensing_program_id_idx',
  ['licensingProgramId'],
  {},
)
@Index('oem_company_channels_is_active_idx', ['isActive'], {})
@Index('oem_company_channels_is_enabled_idx', ['isEnabled'], {})
@Entity('oem_company_channels', { schema: 'oem' })
export class CompanyChannel {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'company_channel_id',
  })
  companyChannelId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  /*@Column({
    type: 'integer',
    name: 'channel_id',
  })
  channelId: number;*/

  @Column({
    type: 'integer',
    name: 'company_channel_setting_id',
  })
  companyChannelSettingId: number;

  @Column({
    type: 'integer',
    name: 'geo_hierarchy_id',
  })
  geoHierarchyId: number;

  @Column({
    type: 'integer',
    name: 'company_program_id',
  })
  companyProgramId: number;

  @Column({
    type: 'integer',
    name: 'licensing_program_id',
    nullable: true,
    default: null,
  })
  licensingProgramId: number;

  @Column('enum', {
    name: 'channel_type',
    enum: ChannelTypeEnum,
    default: ChannelTypeEnum.RESELLER,
  })
  channelType: ChannelTypeEnum;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  //TODO: for each entity we should move this section to SystemMeta sybType
  //----
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
  //-----

  @ManyToOne(
    () => OemCompanyEntity,
    (oemCompany) => oemCompany.companyChannels,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @ManyToOne(
    () => OemHierarchyEntity,
    (oemHierarchy) => oemHierarchy.companyChannels,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn([
    { name: 'geo_hierarchy_id', referencedColumnName: 'hierarchyId' },
  ])
  geoHierarchy: OemHierarchyEntity;

  @ManyToOne(
    () => OemCompanyProgram,
    (oemCompanyProgram) => oemCompanyProgram.companyChannel,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn([
    { name: 'company_program_id', referencedColumnName: 'companyProgramId' },
  ])
  companyProgram: OemCompanyProgram;

  @OneToOne(
    () => OemCompanyChannelSetting,
    (oemCompanyChannelSetting) => oemCompanyChannelSetting.companyChannel,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn([
    {
      name: 'company_channel_setting_id',
      referencedColumnName: 'companyChannelSettingId',
    },
  ])
  companyChannelSetting: OemCompanyChannelSetting;

  @OneToOne(
    () => OemLicensingProgramEntity,
    (licensingProgram) => licensingProgram.companyChannel,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn([
    {
      name: 'licensing_program_id',
      referencedColumnName: 'licensingProgramId',
    },
  ])
  licensingProgram: OemLicensingProgramEntity;

  @OneToMany(() => OemUserEntity, (users) => users.companyChannel)
  users: OemUserEntity[];

  @OneToMany(
    () => OemQuoteCompanyChannel,
    (quoteCompanyChannels) => quoteCompanyChannels.companyChannel,
  )
  quoteCompanyChannels: OemQuoteCompanyChannel[];

  @OneToMany(
    () => CompanyChannelAddressEntity,
    (companyChannelAddress) => companyChannelAddress.companyChannel,
  )
  companyChannelAddresses: CompanyChannelAddressEntity[];
}

export { CompanyChannel as OemCompanyChannel };
