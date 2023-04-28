import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OemDiscountRuleEntity } from '../../main/oem-rules/oem-discount-rules/oem-discount-rule.entity';
import { OemDiscountEntity } from '../../main/oem-discounts/oem-discount.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_discounts_discount_rules_id_idx', ['discountRuleId'], {})
@Index('oem_discounts_discount_rules_discount_id_idx', ['discountId'], {})
@Entity('oem_discounts_discounts_rules', { schema: 'oem' })
export class DiscountRulesDiscounts {
  constructor(data: Partial<DiscountRulesDiscounts> = {}) {
    Object.assign(this, data);
  }
  @PrimaryColumn({ type: 'integer', name: 'discount_id' })
  discountId: number;

  @PrimaryColumn({ type: 'integer', name: 'discount_rule_id' })
  discountRuleId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

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

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @ManyToOne(
    () => OemDiscountRuleEntity,
    (oemDiscountEntity) => oemDiscountEntity.discountRulesDiscounts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'discount_rule_id', referencedColumnName: 'discountRuleId' },
  ])
  discountRule: OemDiscountRuleEntity;

  @ManyToOne(
    () => OemDiscountEntity,
    (oemDiscountEntity) => oemDiscountEntity.discountRulesDiscounts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'discount_id',
      referencedColumnName: 'discountId',
    },
  ])
  discount: OemDiscountEntity;
}

export { DiscountRulesDiscounts as OemDiscountRulesDiscounts };
