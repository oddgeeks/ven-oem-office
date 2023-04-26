import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import { OemCompanyEntity } from '../../main/oem-companies/oem-company.entity';
import { OemChannelEntity } from '../../main/oem-channels/oem-channel.entity';
import { OemCompanyChannel } from '../_oem-company-channels/oem-company-channel.entity';

@Index('oem_company_programs_pkey', ['companyProgramId'], {
  unique: true,
})
@Index('oem_company_programs_company_id_idx', ['companyId'], {})
@Index('oem_company_programs_channel_id_idx', ['channelId', 'companyId'], {})
@Index('oem_company_programs_is_enabled_idx', ['isEnabled'], {})
@Entity('oem_company_programs', { schema: 'oem' })
export class CompanyProgram {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'company_program_id',
  })
  companyProgramId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({
    type: 'integer',
    name: 'channel_id',
  })
  channelId: number;

  @Column('character varying', {
    name: 'name',
    length: 128,
  })
  name: string;

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

  @ManyToOne(
    () => OemCompanyEntity,
    (oemCompany) => oemCompany.companyPrograms,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @ManyToOne(
    () => OemChannelEntity,
    (oemChannel) => oemChannel.companyPrograms,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'channel_id', referencedColumnName: 'channelId' }])
  channel: OemChannelEntity;

  @OneToOne(
    () => OemCompanyChannel,
    (oemCompanyChannel) => oemCompanyChannel.companyProgram,
  )
  companyChannel: OemCompanyChannel;
}

export { CompanyProgram as OemCompanyProgram };
