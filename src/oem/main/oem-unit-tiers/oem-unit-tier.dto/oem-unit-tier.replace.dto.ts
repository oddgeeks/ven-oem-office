import { OmitType } from '@nestjs/swagger';
import { UnitTierDto } from './oem-unit-tier.dto';

export class UnitTierReplaceDto extends OmitType(UnitTierDto, [
  'unitTierId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'pricingModel',
  'priceTiers',
] as const) {}

export { UnitTierReplaceDto as OemUnitTierReplaceDto };
