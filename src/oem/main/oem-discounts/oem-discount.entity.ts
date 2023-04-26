import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiscountTypeEnum } from './oem-discount.enums/discount-type.enum';
import { ApplicableToEnum } from './oem-discount.enums/applicable-to.enum';
import { PositionEnum } from './oem-discount.enums/position.enum';
import { OemDiscountRulesDiscounts } from '../../intermediaries/_oem-discount-rules-discounts/oem-discount-rules-discounts.entity';
import { OemDiscountPriorities } from '../../intermediaries/_oem-discount-priorities/oem-discount-priorities.entity';

import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_discounts_pkey', ['discountId'], { unique: true })
@Index('oem_discounts_company_id_idx', ['companyId'], {})
//@Index('oem_discounts_quote_id_idx', ['quoteId'], {})
//@Index('oem_discounts_list_price_id_idx', ['visibleProductFieldId'])
@Entity('oem_discounts', { schema: 'oem' })
export class Discount {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'discount_id' })
  discountId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('character varying', {
    name: 'name',
    nullable: true,
    length: 128,
  })
  name: string;

  @Column('integer', {
    name: 'priority',
    nullable: true,
    // unique: true,
    generated: true,
  })
  priority: number;

  /*
   /* @Column('integer', { name: 'discount_rule_id' })
   discountRuleId: number;

   @Column('integer', { name: 'quote_id' })
   quoteId: number;

  @Column('float', { name: 'value' })
  value: number;*/

  @Column('enum', { name: 'discount_type', enum: DiscountTypeEnum })
  discountType: DiscountTypeEnum;

  @Column('enum', { name: 'applicable_to', enum: ApplicableToEnum })
  applicableTo: ApplicableToEnum;

  @Column('enum', { name: 'position', enum: PositionEnum })
  position: PositionEnum;

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

  /*@Column('integer', { name: 'discount_list_price_id' })
  visibleProductFieldId: number;

  @ManyToOne(
    () => OemDiscountListPriceEntity,
    (oemDiscountListPrice) => oemDiscountListPrice.discounts,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn([
    {
      name: 'discount_list_price_id',
      referencedColumnName: 'visibleProductFieldId',
    },
  ])
  discountListPrice: OemDiscountListPriceEntity;*/

  /* @ManyToOne(
     () => OemDiscountRuleEntity,
     (oemDiscountRuleEntity) => oemDiscountRuleEntity.discounts,
     { onDelete: 'RESTRICT' },
   )
   @JoinColumn([
     {
       name: 'discount_rule_id',
       referencedColumnName: 'discountRuleId',
     },
   ])
   discountRule: OemDiscountRuleEntity;

   @ManyToOne(
     () => OemQuoteEntity,
     (oemDiscountListPrice) => oemDiscountListPrice.discounts,
     { onDelete: 'CASCADE' },
   )
   @JoinColumn([
     {
       name: 'quote_id',
       referencedColumnName: 'quoteId',
     },
   ])
   quote: OemQuoteEntity;*/

  @OneToMany(
    () => OemDiscountPriorities,
    (oemDiscountPriorities) => oemDiscountPriorities.sourceDiscount,
    {},
  )
  sourceDiscounts: OemDiscountPriorities[];

  @OneToMany(
    () => OemDiscountPriorities,
    (oemDiscountPriorities) => oemDiscountPriorities.targetDiscount,
    {},
  )
  targetDiscounts: OemDiscountPriorities[];

  @OneToMany(
    () => OemDiscountRulesDiscounts,
    (oemDiscountRulesDiscounts) => oemDiscountRulesDiscounts.discount,
    {},
  )
  discountRulesDiscounts: OemDiscountRulesDiscounts[];
}

export { Discount as OemDiscountEntity };
