import { OmitType } from '@nestjs/swagger';
import { OemPriceTierDto } from './oem-price-tier.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class PriceTierReplaceDto extends OmitType(OemPriceTierDto, [
  'priceTierId',
  'isEnabled',
  'createdAt',
  'updatedAt',
] as const) {}

export { PriceTierReplaceDto as OemPriceTierReplaceDto };
