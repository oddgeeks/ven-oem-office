import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../../oem-companies/oem-company.entity';
import { WorkflowRuleLogicType } from './oem-workflow-rule.type/workflow-rule-logic.type';
import { OemUserEntity } from '../../oem-users/oem-user.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../../environments';

@Index('oem_workflow_rules_company_id_idx', ['companyId'], {})
@Index('oem_workflow_rules_owner_user_id_idx', ['ownerUserId'], {})
@Index('oem_workflow_rules_pkey', ['workflowRuleId'], { unique: true })
@Index('oem_workflow_rules_rule_name_idx', ['workflowRuleName', 'companyId'], {
  unique: true,
})
@Entity('oem_workflow_rules', { schema: 'oem' })
export class WorkflowRule {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'workflow_rule_id' })
  workflowRuleId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({ type: 'integer', name: 'owner_user_id' })
  ownerUserId: number;

  @Column('character varying', { name: 'workflow_rule_name', length: 256 })
  workflowRuleName: string;

  @Column('jsonb', { name: 'workflow_rule_logic' })
  workflowRuleLogic: WorkflowRuleLogicType;

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

  @Column('boolean', { name: 'is_catchall', default: false })
  isCatchall: boolean;

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

  @ManyToOne(() => Company, (oemCompanies) => oemCompanies.workflowRules)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: Company;

  @ManyToOne(() => OemUserEntity, (oemUsers) => oemUsers.workflowRules, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'owner_user_id', referencedColumnName: 'userId' }])
  ownerUser: OemUserEntity;
}

export { WorkflowRule as OemWorkflowRule };
