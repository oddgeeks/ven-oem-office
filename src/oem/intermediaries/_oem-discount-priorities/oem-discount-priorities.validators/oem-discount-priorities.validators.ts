import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IsInt,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { OemDiscountEntity } from '../../../main/oem-discounts/oem-discount.entity';
import { DiscountPrioritiesDto } from '../oem-discount-priorities.dto/oem-discount-priorities.dto';
import { SetCurrentTenant } from '../../../../common/decorators/set-current-tenant.decorator';

@ValidatorConstraint({ name: 'isDiscountHasSameType', async: true })
@Injectable()
@SetCurrentTenant
export class IsDiscountHasSameType implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(OemDiscountEntity)
    private readonly repo: Repository<OemDiscountEntity>,
  ) {}

  async validate(
    discountId: number,
    args: ValidationArguments,
  ): Promise<boolean> {
    const dto = args.object as DiscountPrioritiesDto;

    const sourceDiscount = await this.repo.findOne({
      discountId: dto.sourceDiscountId,
    });
    const targetDiscount = await this.repo.findOne({
      discountId: dto.targetDiscountId,
    });

    if (!sourceDiscount || !targetDiscount) return false;
    else return sourceDiscount.applicableTo == targetDiscount.applicableTo;
  }

  defaultMessage(): string {
    return 'The source and target discounts are not applicable';
  }
}
