import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { VendoApprovalQueueStatusEnum } from './oem-vendo-approval-queue.enums/vendo-approval-queue-status.enum';
import { VendoApprovalQueueTargetTypeEnum } from './oem-vendo-approval-queue.enums/vendo-approval-queue-target-type.enum';
import { OemCompanyEntity } from '../../../main/oem-companies/oem-company.entity';
import { OemUserEntity } from '../../../main/oem-users/oem-user.entity';
import { OemVendoEntity } from '../../../main/oem-vendos/oem-vendo.entity';
import { OemApprovalQueuePriority } from '../../../main/oem-approval-queue-priorities/oem-approval-queue-priority.entity';
import { OemNotification } from '../../../main/oem-notifications/oem-notification.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../../environments';

@Index('oem_vendo_approval_queues_pkey', ['vendoApprovalQueueId'], {
  unique: true,
})
@Index('oem_vendo_approval_queues_company_id_idx', ['companyId'], {})
@Index('oem_vendo_approval_queues_user_id_idx', ['userId'], {})
@Index('oem_vendo_approval_queues_vendo_id_idx', ['vendoId'], {})
@Index('oem_vendo_approval_queues_token_idx', ['token'], {})
@Index(
  'oem_vendo_approval_queues_priority_id_idx',
  ['approvalQueuePriorityId'],
  {},
)
@Index('oem_vendo_approval_queues_target_type_idx', ['targetType'], {})
@Entity('oem_vendo_approval_queues', { schema: 'oem' })
export class VendoApprovalQueue {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'vendo_approval_queue_id',
  })
  vendoApprovalQueueId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({ type: 'integer', name: 'user_id', nullable: true, default: null })
  userId: number;

  @Column({ type: 'integer', name: 'vendo_id' })
  vendoId: number;

  @Column({
    type: 'integer',
    name: 'approval_queue_priority_id',
    nullable: true,
    default: null,
  })
  approvalQueuePriorityId: number;

  @Column('character varying', {
    name: 'token',
    length: 256,
    nullable: true,
    default: null,
  })
  token: string;

  @Column('enum', {
    name: 'status',
    enum: VendoApprovalQueueStatusEnum,
    default: VendoApprovalQueueStatusEnum.PENDING,
  })
  status: VendoApprovalQueueStatusEnum;

  @Column('enum', {
    name: 'target_type',
    enum: VendoApprovalQueueTargetTypeEnum,
    default: VendoApprovalQueueTargetTypeEnum.USER,
  })
  targetType: VendoApprovalQueueTargetTypeEnum;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column('timestamp with time zone', {
    name: 'expires_at',
    nullable: true,
    default: null,
  })
  expiresAt: Date | string;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @ManyToOne(() => OemCompanyEntity, (company) => company.vendoApprovalQueues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @ManyToOne(() => OemUserEntity, (user) => user.vendoApprovalQueues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: OemUserEntity;

  @ManyToOne(() => OemVendoEntity, (vendo) => vendo.vendoApprovalQueues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'vendo_id', referencedColumnName: 'vendoId' }])
  vendo: OemVendoEntity;

  @ManyToOne(
    () => OemApprovalQueuePriority,
    (approvalQueuePriority) => approvalQueuePriority.vendoApprovalQueues,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'approval_queue_priority_id',
      referencedColumnName: 'approvalQueuePriorityId',
    },
  ])
  approvalQueuePriority: OemApprovalQueuePriority;

  @OneToMany(
    () => OemNotification,
    (oemNotifications) => oemNotifications.vendoApprovalQueue,
  )
  notifications: OemNotification[];
}

export { VendoApprovalQueue as OemVendoApprovalQueue };
