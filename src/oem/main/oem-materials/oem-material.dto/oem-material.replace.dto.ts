import { OmitType } from '@nestjs/swagger';
import { OemMaterialDto } from './oem-material.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class MaterialReplaceDto extends OmitType(OemMaterialDto, [
  'materialId',
  'isEnabled',
  'createdAt',
  'updatedAt',
] as const) {}

export { MaterialReplaceDto as OemMaterialReplaceDto };
