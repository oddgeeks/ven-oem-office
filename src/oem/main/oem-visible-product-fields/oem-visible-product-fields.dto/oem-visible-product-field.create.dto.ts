import { OmitType } from '@nestjs/swagger';
import { OemVisibleProductFieldDto } from './oem-visible-product-field.dto';
import { VisibleProductField } from '../oem-visible-product-field.entity';

export class VisibleProductFieldCreateDto extends OmitType(
  OemVisibleProductFieldDto,
  [
    'visibleProductFieldId',
    'isEnabled',
    'companyId',
    'createdAt',
    'updatedAt',
  ] as const,
) {
  constructor(data: Partial<VisibleProductField> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { VisibleProductFieldCreateDto as OemVisibleProductFieldCreateDto };
