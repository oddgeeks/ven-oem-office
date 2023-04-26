import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { QuoteStatusEnum } from '../oem-quote.enums/quote-status.enum';

@ValidatorConstraint({ name: 'statusUpdateValidator' })
@Injectable()
export class StatusUpdateValidator implements ValidatorConstraintInterface {
  validate(status: QuoteStatusEnum) {
    const allowedStatuses = [
      QuoteStatusEnum.DRAFT,
      QuoteStatusEnum.AUTO_APPROVED,
    ];

    return status === undefined || allowedStatuses.includes(status);
  }

  defaultMessage() {
    return 'Invalid quote status';
  }
}
