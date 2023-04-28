import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiscountRuleLogicType } from './oem-discount-rule.types/discount-rule-logic.type';
import { DiscountRuleTypeEnum } from './oem-discount-rule.enums/discount-rule.enum';
import { OemDiscountRulesDiscounts } from '../../../intermediaries/_oem-discount-rules-discounts/oem-discount-rules-discounts.entity';
import { OemUserEntity } from '../../oem-users/oem-user.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../../environments';

@Index('oem_discount_rules_pkey', ['discountRuleId', 'companyId'], {
  unique: true,
})
@Index('oem_discount_rules_company_id_idx', ['companyId'], {})
@Index('oem_discount_rules_user_id_idx', ['ownerUserId'], {})
@Index(
  'oem_discount_rules_discount_rule_name_idx',
  ['discountRuleName', 'companyId'],
  { unique: true },
)
@Entity('oem_discount_rules', { schema: 'oem' })
export class DiscountRule {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'discount_rule_id' })
  discountRuleId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('integer', { name: 'owner_user_id' })
  ownerUserId: number;

  @Column('character varying', { name: 'discount_rule_name', length: 256 })
  discountRuleName: string;

  @Column('jsonb', {
    name: 'discount_rule_logic',
  })
  discountRuleLogic: DiscountRuleLogicType;

  @Column('enum', {
    name: 'discount_rule_type',
    enum: DiscountRuleTypeEnum,
  })
  discountRuleType: DiscountRuleTypeEnum;

  @OneToMany(
    () => OemDiscountRulesDiscounts,
    (oemDiscountRulesDiscounts) => oemDiscountRulesDiscounts.discountRule,
    {},
  )
  discountRulesDiscounts: OemDiscountRulesDiscounts[];

  @ManyToOne(() => OemUserEntity, (oemUsers) => oemUsers.discountRules)
  @JoinColumn([{ name: 'owner_user_id', referencedColumnName: 'userId' }])
  ownerUser: OemUserEntity;

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

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

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
}

export { DiscountRule as OemDiscountRuleEntity };
