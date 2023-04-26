import { PartialType } from '@nestjs/swagger';
import { OemVisibleProductFieldDto } from './oem-visible-product-field.dto';
import { VisibleProductField } from '../oem-visible-product-field.entity';

export class VisibleProductFieldSerializeDto extends PartialType(
  OemVisibleProductFieldDto,
) {
  constructor(data: Partial<VisibleProductField> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { VisibleProductFieldSerializeDto as OemVisibleProductFieldSerializeDto };
