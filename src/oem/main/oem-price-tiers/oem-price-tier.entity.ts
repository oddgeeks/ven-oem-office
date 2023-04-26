import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OemProductEntity } from '../oem-products/oem-product.entity';
import { OemUnitTierEntity } from '../oem-unit-tiers/oem-unit-tier.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_price_tiers_pkey', ['priceTierId'], { unique: true })
@Entity('oem_price_tiers', { schema: 'oem' })
export class PriceTier {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'price_tier_id' })
  priceTierId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({ type: 'integer', name: 'unit_tier_id' })
  unitTierId: number;

  @Column({ type: 'integer', name: 'product_id' })
  productId: number;

  @Column('real', {
    name: 'cogs_unit',
    default: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  cogsUnit: number;

  @Column('real', {
    name: 'price_unit',
    default: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  priceUnit: number;

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

  @ManyToOne(() => OemProductEntity, (oemProducts) => oemProducts.priceTiers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'productId' }])
  product: OemProductEntity;

  @ManyToOne(
    () => OemUnitTierEntity,
    (oemUnitTiers) => oemUnitTiers.priceTiers,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn([{ name: 'unit_tier_id', referencedColumnName: 'unitTierId' }])
  unitTier: OemUnitTierEntity;
}

export { PriceTier as OemPriceTierEntity };
