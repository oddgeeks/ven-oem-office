import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ListNameEnum } from './oem-visible-product-fields.enums/list-name.enum';
import { OemRolesVisibleProductFields } from '../../intermediaries/_oem-roles-visible-product-fields/oem-roles-visible-product-fields.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_visible_product_field_pkey', ['visibleProductFieldId'], {
  unique: true,
})
@Index('oem_visible_product_field_company_id_idx', ['companyId'], {})
@Entity('oem_visible_product_fields', { schema: 'oem' })
export class VisibleProductField {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'visible_product_field_id' })
  visibleProductFieldId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('character varying', {
    name: 'custom_name',
    nullable: true,
    length: 128,
  })
  customName: string | null;

  @Column('enum', {
    name: 'list_name',
    enum: ListNameEnum,
  })
  listName: ListNameEnum;

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

  /*@OneToMany(
    () => OemDiscountEntity,
    (oemDiscount) => oemDiscount.discountListPrice,
  )
  discounts: OemDiscountEntity[];*/

  @OneToMany(
    () => OemRolesVisibleProductFields,
    (oemRolesDiscountListPrices) =>
      oemRolesDiscountListPrices.visibleProductField,
  )
  rolesVisibleProductFields: OemRolesVisibleProductFields[];
}

export { VisibleProductField as OemVisibleProductFieldEntity };
