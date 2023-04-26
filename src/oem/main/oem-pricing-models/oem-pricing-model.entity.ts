import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../oem-companies/oem-company.entity';
import { OemProductEntity } from '../oem-products/oem-product.entity';

import { ModelTypeEnum } from './oem-pricing-model.enums/model-type.enum';
import { PricingTypeEnum } from './oem-pricing-model.enums/pricing-type.enum';
import { UnitDurationEnum } from './oem-pricing-model.enums/unit-duration.enum';
import { OemUnitTierEntity } from '../oem-unit-tiers/oem-unit-tier.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_pricing_models_company_id_idx', ['companyId'], {})
@Index('oem_pricing_models_pkey', ['pricingModelId'], {
  unique: true,
})
@Entity('oem_pricing_models', { schema: 'oem' })
export class PricingModel {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'pricing_model_id' })
  pricingModelId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('character varying', { name: 'model_name', length: 128 })
  modelName: string;

  @Column('enum', {
    name: 'model_type',
    enum: ModelTypeEnum,
  })
  modelType: ModelTypeEnum;

  @Column('enum', {
    name: 'pricing_type',
    enum: PricingTypeEnum,
  })
  pricingType: PricingTypeEnum;

  //removed VEN-514
  /* @Column('enum', {
     name: 'unit_metric',
     enum: UnitMetricEnum,
   })
   unitMetric: UnitMetricEnum;*/
  @Column('character varying', { name: 'unit_metric', length: 128 })
  unitMetric: string;

  @Column('enum', {
    name: 'unit_duration',
    enum: UnitDurationEnum,
  })
  unitDuration: UnitDurationEnum;

  /* @Column('character varying', { name: 'unit_duration', length: 128 })
   unitDuration: string;*/

  @Column('boolean', { name: 'tiers_enabled' })
  tiersEnabled: boolean;

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

  @OneToMany(
    () => OemUnitTierEntity,
    (oemUnitTiers) => oemUnitTiers.pricingModel,
  )
  unitTiers: OemUnitTierEntity[];

  @ManyToOne(() => Company, (oemCompanies) => oemCompanies.pricingModels)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: Company;

  @OneToMany(() => OemProductEntity, (oemProducts) => oemProducts.pricingModel)
  products: OemProductEntity[];
}

export { PricingModel as OemPricingModelEntity };
