import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { VendoStatusEnum } from '../oem-vendo.enums/vendo-status.enum';

@ValidatorConstraint({ name: 'statusUpdateValidator' })
@Injectable()
export class StatusUpdateValidator implements ValidatorConstraintInterface {
  validate(status: VendoStatusEnum) {
    const allowedStatuses = [
      VendoStatusEnum.DRAFT,
      VendoStatusEnum.AUTO_APPROVED,
    ];

    return status === undefined || allowedStatuses.includes(status);
  }

  defaultMessage() {
    return 'Invalid vendo status';
  }
}
