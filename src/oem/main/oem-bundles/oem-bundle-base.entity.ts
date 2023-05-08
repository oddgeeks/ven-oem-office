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
import { ProductAvailabilityEnum } from '../oem-products/oem-product.enums/product-availability.enum';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { OemProductsRelationships } from '../../intermediaries/_oem-products-relationships/oem-products-relationships.entity';
import { OemHierarchyEntity } from '../oem-hierarchies/oem-hierarchy.entity';

import { EligibleForEnum } from '../oem-products/oem-product.enums/eligible-for.enum';
import { MetadataEntity } from '../../../common/entities/metadata.entity';
import { Expose } from 'class-transformer';

/*
 There is an issue with typescript building circulation dependency, thats why we need DRY =(
 issue https://stackoverflow.com/questions/43176006/typeerror-class-extends-value-undefined-is-not-a-function-or-null
 https://stackoverflow.com/questions/38841469/how-to-fix-this-es6-module-circular-dependency/42704874#42704874
 ** My thoughts: Probably we can merge bundle and product modules in one folder
 */
@Index('oem_products_owner_user_id_idx', ['ownerUserId'], {})
@Index('oem_products_product_hierarchy_id_idx', ['productHierarchyId'], {})
@Index('oem_products_pkey', ['productId', 'companyId'], { unique: true })
@Entity('oem_products', { schema: 'oem' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class BundleBaseEntity extends MetadataEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'product_id' })
  @Expose({ name: 'bundleId' })
  productId: number;

  //@Expose({ name: 'bundleName' })
  productName: string;

  @Column({ type: 'integer', name: 'product_hierarchy_id' })
  productHierarchyId: number;

  @Column({ type: 'integer', name: 'owner_user_id' })
  ownerUserId: number;

  @Column('character varying', { name: 'sku_number', length: 64 })
  skuNumber: string;

  @Column('enum', {
    name: 'product_availability',
    enum: Object.values(ProductAvailabilityEnum),
    array: true,
    default: [ProductAvailabilityEnum.CURRENT_PRODUCT],
  })
  productAvailability: Array<ProductAvailabilityEnum>;

  @Column({
    type: 'character varying',
    name: 'sf_product_id',
    nullable: true,
    default: null,
  })
  sfProductId: string | null;

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

export { BundleBaseEntity as OemBundleBaseEntity };
