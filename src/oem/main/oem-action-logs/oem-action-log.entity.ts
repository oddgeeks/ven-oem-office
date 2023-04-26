import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { PermitCreditCardsEnum } from '../oem-companies/oem-company.enums/permit-credit-cards.enum';
import { ActionLogTypeEnum } from './oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from './oem-action-log.enums/actions.enum';

@Index('oem_action_logs_pkey', ['actionLogId'], { unique: true })
@Index('oem_action_logs_company_id_idx', ['companyId'], {})
@Index('oem_action_logs_subject_idx', ['subject'], {})
@Entity('oem_action_logs', { schema: 'oem' })
export class OemActionLogEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'action_log_id' })
  actionLogId: number;

  @Column({ type: 'integer', name: 'company_id' })
  companyId: number;

  @Column('enum', {
    name: 'type',
    enum: ActionLogTypeEnum,
  })
  type: ActionLogTypeEnum;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
    //default: () => '{}',
    name: 'association',
  })
  association: object;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
    //default: () => '{}',
    name: 'subject',
  })
  subject: object;

  @Column('enum', { name: 'action', enum: ActionsEnum })
  action: ActionsEnum;

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
}
