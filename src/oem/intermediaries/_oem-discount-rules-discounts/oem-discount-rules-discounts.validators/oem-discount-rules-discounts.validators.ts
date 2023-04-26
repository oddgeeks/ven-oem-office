import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { OemDiscountEntity } from '../../../main/oem-discounts/oem-discount.entity';
import { DiscountTypeEnum } from '../../../main/oem-discounts/oem-discount.enums/discount-type.enum';
import { SetCurrentTenant } from '../../../../common/decorators/set-current-tenant.decorator';

@ValidatorConstraint({ name: 'isDiscountProgram', async: true })
@Injectable()
@SetCurrentTenant
export class IsDiscountProgram implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(OemDiscountEntity)
    private readonly repo: Repository<OemDiscountEntity>,
  ) {}

  async validate(discountId: number): Promise<boolean> {
    const discount = await this.repo.findOne({ discountId: discountId });
    return discount.discountType === DiscountTypeEnum.PROGRAM;
  }

  defaultMessage(): string {
    return 'The discount type is not Program';
  }
}
