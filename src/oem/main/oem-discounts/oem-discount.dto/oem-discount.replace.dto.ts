import { OmitType } from '@nestjs/swagger';
import { Discount } from '../oem-discount.entity';
import { OemDiscountDto } from './oem-discount.dto';

export class DiscountReplaceDto extends OmitType(OemDiscountDto, [
  'discountId',
  'isEnabled',
  'createdAt',
  'companyId',
  'updatedAt',
] as const) {
  constructor(data: Partial<Discount> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { DiscountReplaceDto as OemDiscountReplaceDto };
