import { OmitType } from '@nestjs/swagger';
import { Discount } from '../oem-discount.entity';
import { OemDiscountDto } from './oem-discount.dto';
import { IsOptional } from 'class-validator';
import { DiscountTypeEnum } from '../oem-discount.enums/discount-type.enum';
import { ApplicableToEnum } from '../oem-discount.enums/applicable-to.enum';
import { PositionEnum } from '../oem-discount.enums/position.enum';

export class DiscountUpdateDto extends OmitType(OemDiscountDto, [
  'discountId',
  'isEnabled',
  'companyId',
  'createdAt',
  'updatedAt',
] as const) {
  constructor(data: Partial<Discount> = {}) {
    super();
    Object.assign(this, data);
  }

  @IsOptional()
  discountId: number;
  @IsOptional()
  companyId: number;
  @IsOptional()
  discountType: DiscountTypeEnum;
  @IsOptional()
  applicableTo: ApplicableToEnum;
  @IsOptional()
  position: PositionEnum;
  @IsOptional()
  isActive: boolean;
  /*  @IsOptional()
    discountRuleId: number;
    @IsOptional()
    quoteId: number;
    @IsOptional()
    visibleProductFieldId: number;
    @IsOptional()
    value: number;*/
}

export { DiscountUpdateDto as OemDiscountUpdateDto };
