import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OemDiscountEntity } from '../../main/oem-discounts/oem-discount.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_discount_priorities_source_id_idx', ['sourceDiscountId'], {})
@Index('oem_discounts_priorities_target_id_idx', ['targetDiscountId'], {})
@Entity('oem_discount_priorities', { schema: 'oem' })
export class DiscountPriorities {
  constructor(data: Partial<DiscountPriorities> = {}) {
    Object.assign(this, data);
  }
  @PrimaryColumn({ type: 'integer', name: 'source_discount_id' })
  sourceDiscountId: number;

  @PrimaryColumn({ type: 'integer', name: 'target_discount_id' })
  targetDiscountId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('numeric', {
    name: 'priority',
    /* unique: true, */
    default: 1,
    precision: 3,
    scale: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseInt(value);
      },
    },
  })
  priority: number;

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
    () => OemDiscountEntity,
    (oemDiscountEntity) => oemDiscountEntity.sourceDiscounts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'source_discount_id', referencedColumnName: 'discountId' },
  ])
  sourceDiscount: OemDiscountEntity;

  @ManyToOne(
    () => OemDiscountEntity,
    (oemDiscountEntity) => oemDiscountEntity.targetDiscounts,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'target_discount_id',
      referencedColumnName: 'discountId',
    },
  ])
  targetDiscount: OemDiscountEntity;
}

export { DiscountPriorities as OemDiscountPriorities };
