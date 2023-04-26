import { Injectable, Logger, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as moment from 'moment-timezone';

import { OemNotificationPreference } from './oem-notification-preference.entity';
import { OemNotificationPreferenceType } from './oem-notification-preference.enums/oem-notification-preference.type.enum';
import { OemNotificationFrequencyType } from './oem-notification-preference.enums/oem-notification-preference.frequency-type.enum';
import { OemNotificationMonthlyValue } from './oem-notification-preference.enums/oem-notification-preference.monthly-value.enum';
import { OemNotificationWeeklyValue } from './oem-notification-preference.enums/oem-notification-preference.weekly-value.enum';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemNotificationPreferencesService extends TypeOrmCrudService<OemNotificationPreference> {
  //TODO: need to use injecting for logger
  private readonly logger = new Logger(OemNotificationPreferencesService.name);

  constructor(
    @InjectRepository(OemNotificationPreference)
    public repo: Repository<OemNotificationPreference>,
  ) {
    super(repo);
  }

  isTimeForFrequencyType(
    notificationPreference: OemNotificationPreference,
    frequencyType: OemNotificationFrequencyType,
  ) {
    const { dailyFrequencyValue, weeklyFrequencyValue, monthlyFrequencyValue } =
      notificationPreference;
    const now = moment.utc();
    let dateString: string;

    switch (frequencyType) {
      case OemNotificationFrequencyType.NEVER:
        return false;
      case OemNotificationFrequencyType.IMMEDIATELY:
        return true;
      case OemNotificationFrequencyType.DAILY:
        {
          dateString = now.format('YYYY-MM-DD');
        }
        break;
      case OemNotificationFrequencyType.WEEKLY:
        {
          const weeks = [
            OemNotificationWeeklyValue.SUNDAY,
            OemNotificationWeeklyValue.MONDAY,
            OemNotificationWeeklyValue.TUESDAY,
            OemNotificationWeeklyValue.WEDNESDAY,
            OemNotificationWeeklyValue.THURSDAY,
            OemNotificationWeeklyValue.FRIDAY,
            OemNotificationWeeklyValue.SATURDAY,
          ];
          const week = weeks.indexOf(weeklyFrequencyValue) || 1;
          dateString = now.clone().week(week).format('YYYY-MM-DD');
        }
        break;
      case OemNotificationFrequencyType.MONTHLY:
        if (monthlyFrequencyValue === OemNotificationMonthlyValue.FIRST) {
          dateString = now.clone().startOf('month').format('YYYY-MM-DD');
        } else if (
          monthlyFrequencyValue === OemNotificationMonthlyValue.MIDDLE
        ) {
          dateString = now.clone().day(15).format('YYYY-MM-DD');
        } else {
          dateString = now.clone().endOf('month').format('YYYY-MM-DD');
        }
        break;
      default:
        return true;
    }

    const dispatchMoment = moment.utc(
      `${dateString} ${dailyFrequencyValue}`,
      'YYYY-MM-DD hh:mm A',
    );
    return dispatchMoment.isSameOrBefore(now);
  }

  isTimeForBatchedEmail(notificationPreference: OemNotificationPreference) {
    const isTime = {
      [OemNotificationPreferenceType.APPROVAL_OR_REJECTION]: true,
      [OemNotificationPreferenceType.OTHER_CHANGES]: true,
      [OemNotificationPreferenceType.SUBMISSION]: true,
      [OemNotificationPreferenceType.TRANSACTION]: true,
    };

    if (!notificationPreference) {
      return isTime;
    }

    isTime[OemNotificationPreferenceType.APPROVAL_OR_REJECTION] =
      this.isTimeForFrequencyType(
        notificationPreference,
        notificationPreference.approvalFrequencyType,
      );
    isTime[OemNotificationPreferenceType.OTHER_CHANGES] =
      this.isTimeForFrequencyType(
        notificationPreference,
        notificationPreference.changeFrequencyType,
      );
    isTime[OemNotificationPreferenceType.SUBMISSION] =
      this.isTimeForFrequencyType(
        notificationPreference,
        notificationPreference.submissionFrequencyType,
      );
    isTime[OemNotificationPreferenceType.TRANSACTION] =
      this.isTimeForFrequencyType(
        notificationPreference,
        notificationPreference.transactionFrequencyType,
      );

    return isTime;
  }
}
