import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../../oem-companies/oem-company.entity';
import { SavedAlertRuleLogicType } from './oem-saved-alert-rule.type/saved-alert-rule-logic.type';
import { OemUserEntity } from '../../oem-users/oem-user.entity';

@Index('oem_saved_alert_rules_company_id_idx', ['companyId'], {})
@Index('oem_saved_alert_rules_user_id_idx', ['userId'], {})
@Index('oem_saved_alert_rules_pkey', ['savedAlertRuleId'], {
  unique: true,
})
@Index('oem_saved_alert_rules_rule_name_idx', ['name', 'companyId'], {
  unique: true,
})
@Entity('oem_saved_alert_rules', { schema: 'oem' })
export class SavedAlertRule {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'saved_alert_rule_id' })
  savedAlertRuleId: number;

  @Column({ type: 'integer', name: 'company_id' })
  companyId: number;

  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column('character varying', { name: 'name', length: 256 })
  name: string;

  @Column('jsonb', { name: 'rule_logic' })
  ruleLogic: SavedAlertRuleLogicType;

  @Column('timestamp with time zone', {
    name: 'start_date',
    default: null,
  })
  startDate: Date;

  @Column('timestamp with time zone', {
    name: 'end_date',
    default: null,
  })
  endDate: Date;

  @Column('boolean', { name: 'is_catch_all', default: false })
  isCatchAll: boolean;

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

  @ManyToOne(() => Company, (oemCompany) => oemCompany.savedAlertRules)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: Company;

  @ManyToOne(() => OemUserEntity, (oemUser) => oemUser.savedAlertRules, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: OemUserEntity;
}

export { SavedAlertRule as OemSavedAlertRule };
