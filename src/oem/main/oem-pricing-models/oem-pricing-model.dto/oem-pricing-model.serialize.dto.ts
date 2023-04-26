import { OemPricingModelDto } from './oem-pricing-model.dto';
import { PartialType } from '@nestjs/swagger';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class PricingModelSerializeDto extends PartialType(OemPricingModelDto) {}

export { PricingModelSerializeDto as OemPricingModelSerializeDto };
