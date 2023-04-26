import { ChildEntity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { OemProductBaseEntity } from './oem-product-base.entity';
import { TermTypeEnum } from './oem-product.enums/term-type.enum';
import { BillingFrequencyEnum } from './oem-product.enums/billing-frequency.enum';
import { CustomBillingFrequencySettingsType } from './oem-product.types/custom-billing-frequency-settings.type';
import { OemCustomersProducts } from '../../intermediaries/_oem-customers-products/oem-customers-products.entity';
import { OemQuotesProducts } from '../../intermediaries/_oem-quotes-products/oem-quotes-products.entity';
import { OemPricingModelEntity } from '../oem-pricing-models/oem-pricing-model.entity';
import { OemPriceTierEntity } from '../oem-price-tiers/oem-price-tier.entity';

export type ProductName = string & { __brand: 'productName' };
export type ProductId = number & { __brand: 'productId' };

@ChildEntity()
export class Product extends OemProductBaseEntity {
  //we need to keep this values to be able to use typeorm seed factory
  //TODO: add __brand, but for that need to fix all stuff in demo/clean seeds
  productName: string;
  productId: number;

  @Column({ type: 'integer', name: 'term' })
  term: number;

  @Column('enum', { name: 'term_type', enum: TermTypeEnum })
  termType: TermTypeEnum;

  @Column('boolean', { name: 'same_unit_price_for_all_tiers' })
  sameUnitPriceForAllTiers: boolean;

  @Column('enum', {
    name: 'billing_frequency',
    enum: BillingFrequencyEnum,
  })
  billingFrequency: BillingFrequencyEnum;

  @Column({
    type: 'character varying',
    name: 'sf_product_id',
    nullable: true,
    default: null,
  })
  sfProductId: string | null;

  @Column({
    type: 'character varying',
    name: 'sf_price_book_id',
    nullable: true,
    default: null,
  })
  sfPriceBookId: string | null;

  @Column({
    type: 'character varying',
    name: 'display_url',
    nullable: true,
    default: null,
  })
  displayUrl: string | null;

  @Column({
    type: 'integer',
    name: 'last_modifier_user_id',
    nullable: true,
    default: null,
  })
  lastModifierUserId: number | null;

  @Column({
    type: 'character varying',
    name: 'product_description',
    nullable: true,
    default: null,
  })
  productDescription: string | null;

  @Column('jsonb', {
    name: 'custom_billing_frequency_settings',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  customBillingFrequencySettings: CustomBillingFrequencySettingsType;

  @Column({
    type: 'character varying',
    name: 'product_code',
    nullable: true,
  })
  productCode: string | null;

  @OneToMany(
    () => OemCustomersProducts,
    (oemCustomersProducts) => oemCustomersProducts.product,
  )
  customersProducts: OemCustomersProducts[];

  @OneToMany(
    () => OemQuotesProducts,
    (oemQuotesProducts) => oemQuotesProducts.product,
  )
  quotesProducts: OemQuotesProducts[];

  @ManyToOne(
    () => OemPricingModelEntity,
    (oemPricingModels) => oemPricingModels.products,
  )
  @JoinColumn([
    { name: 'pricing_model_id', referencedColumnName: 'pricingModelId' },
  ])
  pricingModel: OemPricingModelEntity;

  @OneToMany(() => OemPriceTierEntity, (oemPriceTiers) => oemPriceTiers.product)
  priceTiers: OemPriceTierEntity[];
}

export { Product as OemProductEntity };

export type BundleName = string & { __brand: 'bundleName' };
