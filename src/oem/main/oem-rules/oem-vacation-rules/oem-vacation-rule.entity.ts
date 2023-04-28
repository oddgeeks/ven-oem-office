import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OemCompanyEntity } from '../../oem-companies/oem-company.entity';
import { OemUserEntity } from '../../oem-users/oem-user.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../../environments';

@Index('oem_vacation_rules_company_id_idx', ['companyId'], {})
@Index('oem_vacation_rules_source_user_id_idx', ['sourceUserId'], {})
@Index('oem_vacation_rules_target_user_id_idx', ['targetUserId'], {})
@Index('oem_vacation_rules_pkey', ['vacationRuleId'], { unique: true })
@Index('oem_vacation_rule_rule_name_idx', ['name', 'companyId'], {
  unique: true,
})
@Entity('oem_vacation_rules', { schema: 'oem' })
export class VacationRule {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'vacation_rule_id' })
  vacationRuleId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('character varying', { name: 'name', length: 256 })
  name: string;

  @Column({ type: 'integer', name: 'source_user_id' })
  sourceUserId: number;

  @Column({ type: 'integer', name: 'target_user_id' })
  targetUserId: number;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

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

  @ManyToOne(
    () => OemCompanyEntity,
    (oemCompanies) => oemCompanies.vacationRules,
  )
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @ManyToOne(() => OemUserEntity, (oemUsers) => oemUsers.sourceVacationRules, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'source_user_id', referencedColumnName: 'userId' }])
  sourceUser: OemUserEntity;

  @ManyToOne(() => OemUserEntity, (oemUsers) => oemUsers.targetVacationRules, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'target_user_id', referencedColumnName: 'userId' }])
  targetUser: OemUserEntity;
}

export { VacationRule as OemVacationRule };
