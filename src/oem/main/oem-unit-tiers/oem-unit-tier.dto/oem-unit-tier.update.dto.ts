import { OmitType } from '@nestjs/swagger';
import { UnitTierDto } from './oem-unit-tier.dto';
import { IsOptional } from 'class-validator';

export class UnitTierUpdateDto extends OmitType(UnitTierDto, [
  'unitTierId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'pricingModel',
  'priceTiers',
] as const) {
  @IsOptional()
  pricingModelId: number;
  @IsOptional()
  unitTierName: string;
  @IsOptional()
  startRange: number;
  @IsOptional()
  endRange: number;
}

export { UnitTierUpdateDto as OemUnitTierUpdateDto };
