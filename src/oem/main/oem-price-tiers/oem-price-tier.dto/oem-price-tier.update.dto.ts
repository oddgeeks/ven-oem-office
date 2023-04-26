import { OmitType } from '@nestjs/swagger';
import { OemPriceTierDto } from './oem-price-tier.dto';
import { IsOptional } from 'class-validator';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class PriceTierUpdateDto extends OmitType(OemPriceTierDto, [
  'priceTierId',
  'unitTierId',
  'productId',
  'isEnabled',
  'createdAt',
  'updatedAt',
] as const) {
  @IsOptional()
  cogsUnit: number;

  @IsOptional()
  priceUnit: number;
}

export { PriceTierUpdateDto as OemPriceTierUpdateDto };
