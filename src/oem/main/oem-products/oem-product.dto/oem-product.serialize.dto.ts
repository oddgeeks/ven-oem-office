import { OemProductDto } from './oem-product.dto';
import { PartialType } from '@nestjs/swagger';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class ProductSerializeDto extends PartialType(OemProductDto) {}

export { ProductSerializeDto as OemProductSerializeDto };
