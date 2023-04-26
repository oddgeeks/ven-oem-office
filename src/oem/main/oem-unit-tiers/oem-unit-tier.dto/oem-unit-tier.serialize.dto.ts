import { PartialType } from '@nestjs/swagger';
import { UnitTierDto } from './oem-unit-tier.dto';

export class UnitTierSerializeDto extends PartialType(UnitTierDto) {}

export { UnitTierSerializeDto as OemUnitTierSerializeDto };
