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
import { ShadingRuleLogicType } from './oem-shading-rule.type/shading-rule-logic.type';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../../environments';

@Index('oem_shading_rules_company_id_idx', ['companyId'], {})
@Index('oem_shading_rules_owner_user_id_idx', ['ownerUserId'], {})
@Index('oem_shading_rules_priority_key', ['priority'])
@Index('oem_shading_rules_pkey', ['shadingRuleId'], { unique: true })
@Index('oem_shading_rules_rule_name_idx', ['shadingRuleName', 'companyId'], {
  unique: true,
})
@Entity('oem_shading_rules', { schema: 'oem' })
export class ShadingRule {
  constructor(data: Partial<ShadingRule> = {}) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ type: 'integer', name: 'shading_rule_id' })
  shadingRuleId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({ type: 'integer', name: 'owner_user_id' })
  ownerUserId: number;

  @Column('numeric', {
    name: 'priority',
    precision: 3,
    scale: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  priority: number;

  @Column('character varying', { name: 'shading_rule_name', length: 256 })
  shadingRuleName: string;

  @Column('jsonb', {
    name: 'shading_rule_logic',
    /*transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },*/
  })
  shadingRuleLogic: ShadingRuleLogicType;

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

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

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

  @ManyToOne(
    () => OemCompanyEntity,
    (oemCompanies) => oemCompanies.shadingRules,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @ManyToOne(() => OemUserEntity, (oemUsers) => oemUsers.shadingRules, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'owner_user_id', referencedColumnName: 'userId' }])
  ownerUser: OemUserEntity;
}

export { ShadingRule as OemShadingRule };
