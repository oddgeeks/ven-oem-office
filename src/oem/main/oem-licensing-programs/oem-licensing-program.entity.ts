import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../oem-companies/oem-company.entity';
import { OemCompanyChannel } from '../../intermediaries/_oem-company-channels/oem-company-channel.entity';
import { LicensingProgramTypeEnum } from './oem-licensing-program.enums/licensing-program-type.enum';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_licensing_programs_company_id_idx', ['companyId'], {})
@Index('oem_licensing_programs_pkey', ['licensingProgramId'], {
  unique: true,
})
@Entity('oem_licensing_programs', { schema: 'oem' })
export class LicensingProgram {
  constructor(data: Partial<LicensingProgram> = {}) {
    Object.assign(this, data);
  }
  @PrimaryGeneratedColumn({ type: 'integer', name: 'licensing_program_id' })
  licensingProgramId: number;

  @Column('enum', {
    name: 'licensing_program_type',
    enum: LicensingProgramTypeEnum,
  })
  licensingProgramType: LicensingProgramTypeEnum;

  @Column('character varying', { name: 'licensing_program_name', length: 32 })
  licensingProgramName: string;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('real', { name: 'discount' })
  discount: number;

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

  @ManyToOne(() => Company, (oemCompanies) => oemCompanies.licensingPrograms)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: Company;

  @OneToOne(
    () => OemCompanyChannel,
    (oemCompanyChannel) => oemCompanyChannel.licensingProgram,
  )
  companyChannel: OemCompanyChannel;
}

export { LicensingProgram as OemLicensingProgramEntity };
