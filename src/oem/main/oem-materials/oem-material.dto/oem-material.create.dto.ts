import { OmitType } from '@nestjs/swagger';
import { OemMaterialDto } from './oem-material.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class MaterialCreateDto extends OmitType(OemMaterialDto, [
  'materialId',
  'isEnabled',
  'createdAt',
  'updatedAt',
] as const) {}

export { MaterialCreateDto as OemMaterialCreateDto };
