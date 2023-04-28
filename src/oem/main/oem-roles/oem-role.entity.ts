import {
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OemCompanyEntity } from '../oem-companies/oem-company.entity';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { RoleTypeEnum } from './oem-role.enums/role-type.enum';
import { DataAccessEnum } from './oem-role.enums/data-access.enum';
import { CreateAccessEnum } from './oem-role.enums/create-access.enum';
import { FunctionTypeEnum } from './oem-role.enums/function-type.enum';
import { OemRolesVisibleProductFields } from '../../intermediaries/_oem-roles-visible-product-fields/oem-roles-visible-product-fields.entity';
import { ApprovalQueuePriority } from '../oem-approval-queue-priorities/oem-approval-queue-priority.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_roles_company_id_idx', ['companyId'], {})
@Index('oem_roles_role_name_idx', ['companyId', 'roleName'], {
  unique: true,
})
@Index('oem_roles_pkey', ['roleId'], { unique: true })
@Entity('oem_roles', { schema: 'oem' })
export class Role {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'role_id' })
  roleId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('character varying', {
    name: 'role_name',
    length: 128,
  })
  roleName: string;

  @Generated('increment')
  @Column()
  /* @Column('numeric', {
    name: 'priority',
    /!*unique: true,*!/
    scale: 0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseInt(value);
      },
    },
  })*/
  priority: number;

  @Column('enum', {
    name: 'role_type',
    enum: RoleTypeEnum,
  })
  roleType: RoleTypeEnum;

  @Column('enum', {
    name: 'function_type',
    enum: FunctionTypeEnum,
    nullable: true,
    default: null,
  })
  functionType: FunctionTypeEnum;

  @Column('enum', {
    name: 'data_access',
    enum: DataAccessEnum,
  })
  dataAccess: DataAccessEnum;

  @Column('enum', {
    name: 'create_access',
    enum: CreateAccessEnum,
  })
  createAccess: CreateAccessEnum;

  @Column('boolean', { name: 'is_active' })
  isActive: boolean;

  @Column('boolean', { name: 'is_export_right' })
  isExportRight: boolean;

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

  @ManyToOne(() => OemCompanyEntity, (company) => company.roles)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @OneToMany(() => OemUserEntity, (users) => users.role)
  users: OemUserEntity[];

  @OneToMany(
    () => OemRolesVisibleProductFields,
    (roleDiscountListPrice) => roleDiscountListPrice.role,
  )
  visibleProductFields: OemRolesVisibleProductFields[];

  @OneToOne(
    () => ApprovalQueuePriority,
    (approvalQueuePriority) => approvalQueuePriority.role,
  )
  approvalQueuePriority: ApprovalQueuePriority;
}
export { Role as OemRoleEntity };
