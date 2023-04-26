import { OmitType } from '@nestjs/swagger';
import { OemPricingModelDto } from './oem-pricing-model.dto';
import { IsOptional } from 'class-validator';
import { ModelTypeEnum } from '../oem-pricing-model.enums/model-type.enum';
import { PricingTypeEnum } from '../oem-pricing-model.enums/pricing-type.enum';
import { UnitMetricEnum } from '../oem-pricing-model.enums/unit-metric.enum';
import { UnitDurationEnum } from '../oem-pricing-model.enums/unit-duration.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class PricingModelUpdateDto extends OmitType(OemPricingModelDto, [
  'pricingModelId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'companyId',
  'unitTiers',
  'company',
  'products',
] as const) {
  @IsOptional()
  companyId: number;
  @IsOptional()
  modelName: string;
  @IsOptional()
  modelType: ModelTypeEnum;
  @IsOptional()
  pricingType: PricingTypeEnum;
  @IsOptional()
  unitMetric: string;
  @IsOptional()
  unitDuration: UnitDurationEnum;
  @IsOptional()
  tiersEnabled: boolean;
}

export { PricingModelUpdateDto as OemPricingModelUpdateDto };
