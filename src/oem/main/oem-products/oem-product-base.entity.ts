import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { ProductAvailabilityEnum } from './oem-product.enums/product-availability.enum';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { OemProductsRelationships } from '../../intermediaries/_oem-products-relationships/oem-products-relationships.entity';
import { OemHierarchyEntity } from '../oem-hierarchies/oem-hierarchy.entity';

import { EligibleForEnum } from './oem-product.enums/eligible-for.enum';
import { SfProductMetadataEntity } from '../../../shared/salesforce/salesforce.entities.metadata/product.metadata.entity';

@Index('oem_products_owner_user_id_idx', ['ownerUserId'], {})
@Index('oem_products_pricing_model_id_idx', ['pricingModelId'], {})
@Index('oem_products_product_hierarchy_id_idx', ['productHierarchyId'], {})
@Index('oem_products_pkey', ['productId', 'companyId'], { unique: true })
@Entity('oem_products', { schema: 'oem' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
class ProductBaseEntity extends SfProductMetadataEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'product_id' })
  productId: number;

  @Column('character varying', { name: 'product_name', length: 128 })
  productName: string;

  @Column({ type: 'integer', name: 'product_hierarchy_id' })
  productHierarchyId: number;

  @Column({ type: 'integer', name: 'owner_user_id' })
  ownerUserId: number;

  @Column({ type: 'integer', name: 'pricing_model_id', nullable: true })
  pricingModelId: number;

  @Column('character varying', { name: 'sku_number', length: 64 })
  skuNumber: string;

  @Column('enum', {
    name: 'product_availability',
    enum: Object.values(ProductAvailabilityEnum),
    array: true,
    default: [ProductAvailabilityEnum.CURRENT_PRODUCT],
  })
  productAvailability: Array<ProductAvailabilityEnum>;

  @Column('enum', {
    name: 'eligible_for',
    enum: Object.values(EligibleForEnum),
    array: true,
    default: [],
  })
  eligibleFor: Array<EligibleForEnum>;

  @ManyToOne(() => OemUserEntity, (oemUsers) => oemUsers.products)
  @JoinColumn([{ name: 'owner_user_id', referencedColumnName: 'userId' }])
  ownerUser: OemUserEntity;

  @OneToMany(
    () => OemProductsRelationships,
    (oemProductsRelationships) => oemProductsRelationships.sourceProduct,
  )
  productsRelationshipsSources: OemProductsRelationships[];

  @OneToMany(
    () => OemProductsRelationships,
    (oemProductsRelationships) => oemProductsRelationships.targetProduct,
  )
  productsRelationshipsTargets: OemProductsRelationships[];

  @ManyToOne(
    () => OemHierarchyEntity,
    (oemHierarchies) => oemHierarchies.products,
  )
  @JoinColumn([
    { name: 'product_hierarchy_id', referencedColumnName: 'hierarchyId' },
  ])
  productHierarchy: OemHierarchyEntity;
}

export { ProductBaseEntity as OemProductBaseEntity };
