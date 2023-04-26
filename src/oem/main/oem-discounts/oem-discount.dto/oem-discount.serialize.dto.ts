import { OmitType, PartialType } from '@nestjs/swagger';
import { Discount } from '../oem-discount.entity';
import { OemDiscountDto } from './oem-discount.dto';

export class DiscountSerializeDto extends PartialType(OemDiscountDto) {
  constructor(data: Partial<Discount> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { DiscountSerializeDto as OemDiscountSerializeDto };
