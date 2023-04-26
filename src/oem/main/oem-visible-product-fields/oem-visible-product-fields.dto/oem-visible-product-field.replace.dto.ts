import { OmitType } from '@nestjs/swagger';
import { OemVisibleProductFieldDto } from './oem-visible-product-field.dto';
import { VisibleProductField } from '../oem-visible-product-field.entity';

export class VisibleProductFieldReplaceDto extends OmitType(
  OemVisibleProductFieldDto,
  [
    'visibleProductFieldId',
    'isEnabled',
    'createdAt',
    'companyId',
    'updatedAt',
  ] as const,
) {
  constructor(data: Partial<VisibleProductField> = {}) {
    super();
    Object.assign(this, data);
  }
}

export { VisibleProductFieldReplaceDto as OemVisibleProductFieldReplaceDto };
