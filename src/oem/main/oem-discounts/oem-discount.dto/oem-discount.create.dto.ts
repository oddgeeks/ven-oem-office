import { OmitType } from '@nestjs/swagger';
import { Discount } from '../oem-discount.entity';
import { OemDiscountDto } from './oem-discount.dto';

export class DiscountCreateDto extends OmitType(OemDiscountDto, [
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
}

export { DiscountCreateDto as OemDiscountCreateDto };
