import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OemRoleEntity } from '../../main/oem-roles/oem-role.entity';
import { OemVisibleProductFieldEntity } from '../../main/oem-visible-product-fields/oem-visible-product-field.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_roles_visible_product_fields_role_id_idx', ['roleId'], {})
@Index(
  'oem_roles_visible_product_fields_visible_product_id_idx',
  ['roleVisibleProductFieldId', 'roleId', 'visibleProductFieldId'],
  {},
)
@Entity('oem_roles_visible_product_fields', { schema: 'oem' })
export class RolesVisibleProductFields {
  constructor(data: Partial<RolesVisibleProductFields> = {}) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'role_visible_product_field_id',
  })
  roleVisibleProductFieldId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({ type: 'integer', name: 'role_id' })
  roleId: number;

  @Column({ type: 'integer', name: 'visible_product_field_id' })
  visibleProductFieldId: number;

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

  @ManyToOne(() => OemRoleEntity, (oemRoles) => oemRoles.visibleProductFields, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'roleId' }])
  role: OemRoleEntity;

  @ManyToOne(
    () => OemVisibleProductFieldEntity,
    (oemVisibleProductFieldEntity) =>
      oemVisibleProductFieldEntity.rolesVisibleProductFields,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'visible_product_field_id',
      referencedColumnName: 'visibleProductFieldId',
    },
  ])
  visibleProductField: OemVisibleProductFieldEntity;
}

export { RolesVisibleProductFields as OemRolesVisibleProductFields };
