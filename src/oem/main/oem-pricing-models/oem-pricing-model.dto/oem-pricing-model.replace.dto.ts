import { OmitType } from '@nestjs/swagger';
import { OemPricingModelDto } from './oem-pricing-model.dto';
/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class PricingModelReplaceDto extends OmitType(OemPricingModelDto, [
  'pricingModelId',
  'isEnabled',
  'companyId',
  'createdAt',
  'updatedAt',
  'unitTiers',
  'company',
  'products',
] as const) {}

export { PricingModelReplaceDto as OemPricingModelReplaceDto };
