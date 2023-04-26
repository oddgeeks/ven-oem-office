import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OemUserEntity } from '../../main/oem-users/oem-user.entity';
import { OemVendoEntity } from '../../main/oem-vendos/oem-vendo.entity';
import { VendoStatusEnum } from '../../main/oem-vendos/oem-vendo.enums/vendo-status.enum';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_vendos_users_user_id_idx', ['userId'], {})
@Index('oem_vendos_users_vendo_id_idx', ['vendoId'], {})
@Index('oem_vendos_users_approval_status_idx', ['approvalStatus'], {})
@Index('oem_vendos_users_is_saved_alert_user_idx', ['isSavedAlertUser'], {})
@Index('oem_vendos_users_is_workflow_user_idx', ['isWorkflowUser'], {})
@Entity('oem_vendos_users', { schema: 'oem' })
export class VendosUsers {
  @PrimaryColumn({ type: 'integer', name: 'vendo_id' })
  vendoId: number;

  @PrimaryColumn({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column('boolean', { name: 'is_owner', default: false })
  isOwner: boolean;

  @Column('boolean', { name: 'is_approver', default: false })
  isApprover: boolean;

  @Column('enum', {
    name: 'approval_status',
    enum: VendoStatusEnum,
    nullable: true,
    default: null,
  })
  approvalStatus: VendoStatusEnum;

  @Column('boolean', { name: 'is_saved_alert_user', default: false })
  isSavedAlertUser: boolean;

  @Column('boolean', { name: 'is_workflow_user', default: true })
  isWorkflowUser: boolean;

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

  @ManyToOne(() => OemUserEntity, (oemUsers) => oemUsers.vendosUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: OemUserEntity;

  @ManyToOne(() => OemVendoEntity, (oemVendos) => oemVendos.vendosUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'vendo_id', referencedColumnName: 'vendoId' }])
  vendo: OemVendoEntity;
}

export { VendosUsers as OemVendosUsers };
