import { OemPriceTierDto } from './oem-price-tier.dto';
import { PartialType } from '@nestjs/swagger';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class PriceTierSerializeDto extends PartialType(OemPriceTierDto) {}

export { PriceTierSerializeDto as OemPriceTierSerializeDto };
