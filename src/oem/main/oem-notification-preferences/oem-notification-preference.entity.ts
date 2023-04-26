import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { OemCompanyEntity } from '../oem-companies/oem-company.entity';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { OemNotificationFrequencyType } from './oem-notification-preference.enums/oem-notification-preference.frequency-type.enum';
import { OemNotificationMonthlyValue } from './oem-notification-preference.enums/oem-notification-preference.monthly-value.enum';
import { OemNotificationWeeklyValue } from './oem-notification-preference.enums/oem-notification-preference.weekly-value.enum';

@Index('oem_notification_preferences_pkey', ['userId', 'companyId'], {
  unique: true,
})
@Index('oem_notification_preferences_company_id_idx', ['companyId'], {})
@Entity('oem_notification_preferences', { schema: 'oem' })
export class NotificationPreference {
  @PrimaryColumn({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column({ type: 'integer', name: 'company_id' })
  companyId: number;

  @Column('enum', {
    name: 'change_frequency_type',
    enum: OemNotificationFrequencyType,
    default: OemNotificationFrequencyType.IMMEDIATELY,
  })
  changeFrequencyType: OemNotificationFrequencyType;

  @Column('enum', {
    name: 'approval_frequency_type',
    enum: OemNotificationFrequencyType,
    default: OemNotificationFrequencyType.IMMEDIATELY,
  })
  approvalFrequencyType: OemNotificationFrequencyType;

  @Column('enum', {
    name: 'transaction_frequency_type',
    enum: OemNotificationFrequencyType,
    default: OemNotificationFrequencyType.IMMEDIATELY,
  })
  transactionFrequencyType: OemNotificationFrequencyType;

  @Column('enum', {
    name: 'submission_frequency_type',
    enum: OemNotificationFrequencyType,
    default: OemNotificationFrequencyType.IMMEDIATELY,
  })
  submissionFrequencyType: OemNotificationFrequencyType;

  @Column('character varying', {
    name: 'daily_frequency_value',
    length: 8,
    nullable: false,
    default: '12:00 AM',
  })
  dailyFrequencyValue: string;

  @Column('enum', {
    name: 'weekly_frequency_value',
    enum: OemNotificationWeeklyValue,
    default: OemNotificationWeeklyValue.MONDAY,
  })
  weeklyFrequencyValue: OemNotificationWeeklyValue;

  @Column('enum', {
    name: 'monthly_frequency_value',
    enum: OemNotificationMonthlyValue,
    default: OemNotificationMonthlyValue.FIRST,
  })
  monthlyFrequencyValue: OemNotificationMonthlyValue;

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

  @ManyToOne(() => OemCompanyEntity, (oemCompany) => oemCompany.notifications, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'companyId' }])
  company: OemCompanyEntity;

  @OneToOne(() => OemUserEntity, (oemUser) => oemUser.notificationPreference, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: OemUserEntity;
}

export { NotificationPreference as OemNotificationPreference };
