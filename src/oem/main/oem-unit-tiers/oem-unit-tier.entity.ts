import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OemPricingModelEntity } from '../oem-pricing-models/oem-pricing-model.entity';
import { OemPriceTierEntity } from '../oem-price-tiers/oem-price-tier.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_unit_tiers_pkey', ['unitTierId'], { unique: true })
@Index('oem_unit_tiers_pricing_model_id_idx', ['pricingModelId'], {})
@Entity('oem_unit_tiers', { schema: 'oem' })
export class UnitTier {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'unit_tier_id' })
  unitTierId: number;

  @Column({ type: 'integer', name: 'pricing_model_id' })
  pricingModelId: number;

  @Column('character varying', { name: 'unit_tier_name', length: 128 })
  unitTierName: string;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  /* @Column('enum', {
    name: 'unit_tier_type',
    enum: UnitTierTypeEnum,
  })
  unitTierType: UnitTierTypeEnum;*/

  @Column('numeric', {
    name: 'start_range',
    scale: 0,
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
  startRange: number;

  @Column('numeric', {
    name: 'end_range',
    scale: 0,
    nullable: true,
    default: null,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  endRange: number;

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
    () => OemPricingModelEntity,
    (oemPricingModels) => oemPricingModels.unitTiers,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn([
    { name: 'pricing_model_id', referencedColumnName: 'pricingModelId' },
  ])
  pricingModel: OemPricingModelEntity;

  @OneToMany(
    () => OemPriceTierEntity,
    (oemPriceTiers) => oemPriceTiers.unitTier,
  )
  priceTiers: OemPriceTierEntity[];
}

export { UnitTier as OemUnitTierEntity };
