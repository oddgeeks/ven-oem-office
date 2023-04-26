import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../main/oem-products/oem-product.entity';
import { EligibleTypeEnum } from './oem-products-relationships.enums/eligible-type.enum';
import { RelationshipTypeEnum } from './oem-products-relationships.enums/relationship-type.enum';
import { ListPriceTypeEnum } from './oem-products-relationships.enums/list-price-type.enum';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';
import {
  BundleEntity,
  OemBundleEntity,
} from '../../main/oem-bundles/oem-bundle.entity';
import { Transform } from 'class-transformer';
import { isEmpty } from '../../../utils/is-empty.util';

@Index('oem_products_relationships_pkey', ['productRelationshipId'], {
  unique: true,
})
@Index(
  'oem_products_relationships_source_product_id_idx',
  ['sourceProductId'],
  {},
)
@Index(
  'oem_products_relationships_target_product_id_idx',
  ['targetProductId'],
  {},
)
@Entity('oem_products_relationships', { schema: 'oem' })
export class ProductsRelationships {
  constructor(data: Partial<ProductsRelationships> = {}) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ type: 'integer', name: 'product_relationship_id' })
  productRelationshipId: number;

  @Column({ type: 'integer', name: 'source_product_id' })
  sourceProductId: number;

  @Column({ type: 'integer', name: 'target_product_id' })
  targetProductId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('enum', {
    name: 'relationship_type',
    enum: RelationshipTypeEnum,
  })
  relationshipType: RelationshipTypeEnum;

  @Column('enum', {
    name: 'eligible_type',
    enum: EligibleTypeEnum,
  })
  eligibleType: EligibleTypeEnum;

  @Column('enum', {
    name: 'list_price_type',
    enum: ListPriceTypeEnum,
    default: ListPriceTypeEnum.FULL_LIST_PRICE,
  })
  listPriceType: ListPriceTypeEnum;

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

  @ManyToOne(
    () => Product,
    (oemProducts) => oemProducts['productsRelationshipsSources'],
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'source_product_id', referencedColumnName: 'productId' },
  ])
  @Transform(({ value }) => {
    return !isEmpty(value?.pricingModelId) ? value : null;
  })
  sourceProduct: Product;

  @ManyToOne(
    () => BundleEntity,
    (oemProducts) => oemProducts['productsRelationshipsSources'],
    {
      createForeignKeyConstraints: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'source_product_id', referencedColumnName: 'productId' },
  ])
  @Transform(({ value }) => {
    return isEmpty(value?.pricingModelId) &&
      value?.products?.length &&
      value?.products?.length > 0
      ? value
      : null;
  })
  sourceBundle: OemBundleEntity;

  @ManyToOne(
    () => Product,
    (oemProducts) => oemProducts['productsRelationshipsSources'],
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'target_product_id', referencedColumnName: 'productId' },
  ])
  @Transform(({ value }) => {
    return !isEmpty(value?.pricingModelId) ? value : null;
  })
  targetProduct: Product;

  @ManyToOne(
    () => BundleEntity,
    (oemProducts) => oemProducts['productsRelationshipsSources'],
    {
      createForeignKeyConstraints: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'target_product_id', referencedColumnName: 'productId' },
  ])
  @Transform(({ value }) => {
    return isEmpty(value?.pricingModelId) && value?.products?.length > 0
      ? value
      : null;
  })
  targetBundle: OemBundleEntity;
}

export { ProductsRelationships as OemProductsRelationships };
