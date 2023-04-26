import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OemCompanyEntity } from '../oem-companies/oem-company.entity';
import { OemRoleEntity } from '../oem-roles/oem-role.entity';
import { OemQuoteApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { OemVendoApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';
import { DB_MAIN_DATABASE as DB_NAME } from '../../../environments';

@Index('oem_approval_queue_priorities_pkey', ['approvalQueuePriorityId'], {
  unique: true,
})
@Index('oem_approval_queue_priorities_company_id_idx', ['companyId'], {})
@Index('oem_approval_queue_priorities_role_id_idx', ['roleId'], {})
@Index('oem_approval_queue_priorities_priority_idx', ['priority'], {})
@Entity('oem_approval_queue_priorities', { schema: 'oem' })
export class ApprovalQueuePriority {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'approval_queue_priority_id',
  })
  approvalQueuePriorityId: number;

  @Column({
    type: 'int',
    name: 'company_id',
    default: () => `current_setting('${DB_NAME}.current_tenant')::int`,
  })
  companyId: number;

  @Column({ type: 'integer', name: 'role_id' })
  roleId: number;

  @Column('integer', {
    name: 'priority',
    generated: true,
  })
  priority: number;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @Column('boolean', { name: 'is_enabled', default: true })
  isEnabled: boolean;

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

  @ManyToOne(() => OemCompanyEntity, (company) => company.priorities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @OneToOne(() => OemRoleEntity, (role) => role.approvalQueuePriority, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'roleId' }])
  role: OemRoleEntity;

  @OneToMany(
    () => OemQuoteApprovalQueue,
    (quoteApprovalQueues) => quoteApprovalQueues.approvalQueuePriority,
    {
      onDelete: 'CASCADE',
    },
  )
  quoteApprovalQueues: OemQuoteApprovalQueue[];

  @OneToMany(
    () => OemVendoApprovalQueue,
    (vendoApprovalQueues) => vendoApprovalQueues.approvalQueuePriority,
    {
      onDelete: 'CASCADE',
    },
  )
  vendoApprovalQueues: OemVendoApprovalQueue[];
}

export { ApprovalQueuePriority as OemApprovalQueuePriority };
