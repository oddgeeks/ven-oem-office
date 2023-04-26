import {
  ChildEntity,
  Column,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';

import { OemBundleBaseEntity } from './oem-bundle-base.entity';
import { OemProductEntity } from '../oem-products/oem-product.entity';
import { OemCustomersProducts } from '../../intermediaries/_oem-customers-products/oem-customers-products.entity';
import { OemQuotesProducts } from '../../intermediaries/_oem-quotes-products/oem-quotes-products.entity';
import { Expose } from 'class-transformer';

export type BundleName = string & { __brand: 'bundleName' };
export type BundleId = number & { __brand: 'bundleId' };

@ChildEntity()
export class BundleEntity extends OemBundleBaseEntity {
  @Expose({ name: 'bundleName' })
  @Column('character varying', { name: 'product_name', length: 128 })
  bundleName: BundleName;

  // @Expose({ name: 'bundleId' })
  bundleId: BundleId;

  @OneToMany(
    () => OemCustomersProducts,
    (oemCustomersProducts) => oemCustomersProducts.bundle,
  )
  customersBundles: OemCustomersProducts[];

  @OneToMany(
    () => OemQuotesProducts,
    (oemQuotesProducts) => oemQuotesProducts.bundle,
  )
  @JoinColumn({ name: 'productId' })
  quotesBundles: OemQuotesProducts[];

  @Column('jsonb', {
    name: 'bundle_settings',
    default: () => "'[]'",
    nullable: false,
    array: false,
  })
  bundleSettings: object;

  @ManyToMany(() => OemProductEntity, { eager: true })
  @JoinTable({
    name: 'oem_bundles_products',
    joinColumns: [
      // we just need to have companyId for tenants
      {
        name: 'company_id',
        referencedColumnName: 'companyId',
      },
      {
        name: 'product_id',
        referencedColumnName: 'productId',
      },
    ],
    inverseJoinColumns: [
      {
        name: 'bundle_id',
        referencedColumnName: 'productId',
      },
    ],
  })
  products: OemProductEntity[];
}

export { BundleEntity as OemBundleEntity };
