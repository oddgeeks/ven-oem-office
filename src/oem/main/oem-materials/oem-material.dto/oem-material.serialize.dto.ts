import { OemMaterialDto } from './oem-material.dto';
import { PartialType } from '@nestjs/swagger';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class MaterialSerializeDto extends PartialType(OemMaterialDto) {}

export { MaterialSerializeDto as OemMaterialSerializeDto };
