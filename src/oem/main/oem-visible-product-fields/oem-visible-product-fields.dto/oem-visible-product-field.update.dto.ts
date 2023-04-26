import { OmitType } from '@nestjs/swagger';
import { OemVisibleProductFieldDto } from './oem-visible-product-field.dto';
import { VisibleProductField } from '../oem-visible-product-field.entity';
import { IsOptional } from 'class-validator';
import { ListNameEnum } from '../oem-visible-product-fields.enums/list-name.enum';

export class VisibleProductFieldUpdateDto extends OmitType(
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
  @IsOptional()
  visibleProductFieldId: number;
  @IsOptional()
  companyId: number;
  @IsOptional()
  customName: string;
  @IsOptional()
  listName: ListNameEnum;
}

export { VisibleProductFieldUpdateDto as OemVisibleProductFieldUpdateDto };
