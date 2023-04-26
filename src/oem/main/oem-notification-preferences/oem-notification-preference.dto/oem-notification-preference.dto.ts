import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

import { NotificationPreference } from '../oem-notification-preference.entity';
import { Company } from '../../oem-companies/oem-company.entity';
import { User } from '../../oem-users/oem-user.entity';
import { OemNotificationFrequencyType } from '../oem-notification-preference.enums/oem-notification-preference.frequency-type.enum';
import { OemNotificationWeeklyValue } from '../oem-notification-preference.enums/oem-notification-preference.weekly-value.enum';
import { OemNotificationMonthlyValue } from '../oem-notification-preference.enums/oem-notification-preference.monthly-value.enum';

export class NotificationPreferenceDto {
  constructor(data: Partial<NotificationPreference> = {}) {
    Object.assign(this, data);
  }

  /**
   * The id of User
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  /**
   * The id of Сompany
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The User Notification Frequency Type For Quote Changes
   * @example Immediately
   */
  @IsEnum(OemNotificationFrequencyType)
  @IsOptional()
  changeFrequencyType: OemNotificationFrequencyType;

  /**
   * The User Notification Frequency Type For Quote Approval Or Rejection
   * @example Immediately
   */
  @IsEnum(OemNotificationFrequencyType)
  @IsOptional()
  approvalFrequencyType: OemNotificationFrequencyType;

  /**
   * The User Notification Frequency Type For Quote Transactions
   * @example Immediately
   */
  @IsEnum(OemNotificationFrequencyType)
  @IsOptional()
  transactionFrequencyType: OemNotificationFrequencyType;

  /**
   * The User Notification Frequency Type For Quote Submissions
   * @example Immediately
   */
  @IsEnum(OemNotificationFrequencyType)
  @IsOptional()
  submissionFrequencyType: OemNotificationFrequencyType;

  /**
   * The Daily Frequency
   * @example "12:00 AM"
   */
  @IsString()
  @IsOptional()
  @Length(8, 8)
  @Matches(/^(0[1-9]|1[0-2]):[0-5][0-9] [AP]M$/, {
    message: 'Daily frequency value should match the pattern - hh:mm A',
  })
  dailyFrequencyValue: string;

  /**
   * The Weekly Frequency
   * @example Monday
   */
  @IsEnum(OemNotificationWeeklyValue)
  @IsOptional()
  weeklyFrequencyValue: OemNotificationWeeklyValue;

  /**
   * The Monthly Frequency
   * @example 1st day of Month
   */
  @IsEnum(OemNotificationMonthlyValue)
  @IsOptional()
  monthlyFrequencyValue: OemNotificationMonthlyValue;

  /**
   * Is active
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * The date of creating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date;

  /**
   * The date of updating record.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date;

  /**
   * The company
   * @example CompanyEntity
   */
  @Type(() => Company)
  company: Company;

  /**
   * The user
   * @example User
   */
  @Type(() => User)
  user: User;
}

export { NotificationPreferenceDto as OemNotificationPreferenceDto };
