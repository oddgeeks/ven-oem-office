import { ModelTypeEnum } from '../oem-pricing-model.enums/model-type.enum';
import { PricingTypeEnum } from '../oem-pricing-model.enums/pricing-type.enum';
import { UnitMetricEnum } from '../oem-pricing-model.enums/unit-metric.enum';
import { UnitDurationEnum } from '../oem-pricing-model.enums/unit-duration.enum';
import { OemPriceTierEntity } from '../../oem-price-tiers/oem-price-tier.entity';
import { Company } from '../../oem-companies/oem-company.entity';
import { OemProductEntity } from '../../oem-products/oem-product.entity';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OemUnitTierEntity } from '../../oem-unit-tiers/oem-unit-tier.entity';

export class PricingModeDto {
  /**
   * The id of Pricing Model
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  pricingModelId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The id of Model Name
   * @example Model-1
   */
  @IsString()
  @MaxLength(128)
  @IsNotEmpty()
  modelName: string;

  /**
   * The Model Type
   * @example Consumption
   */
  @IsNotEmpty()
  @IsEnum(ModelTypeEnum)
  modelType: ModelTypeEnum;

  /**
   * The Pricing Type
   * @example Flat
   */
  @IsNotEmpty()
  @IsEnum(PricingTypeEnum)
  pricingType: PricingTypeEnum;

  /* /!**
   * The Unit Metric
   * @example Per User
   *!/
  @IsNotEmpty()
  @IsEnum(UnitMetricEnum)
  unitMetric: UnitMetricEnum;
*/

  /**
   * The Unit Metric
   * @example Per User
   */
  @IsNotEmpty()
  @IsString()
  unitMetric: string;

  /**
   * The Unit Duration
   * @example Consumed
   */
  @IsNotEmpty()
  @IsEnum(UnitDurationEnum)
  unitDuration: UnitDurationEnum;

  /* /!**
    * The Unit Duration
    * @example One-Time
    *!/
   @IsNotEmpty()
   @IsString()
   unitDuration: string;
 */
  /**
   * Tiers enabled
   * @example true
   */
  @IsNotEmpty()
  @IsBoolean()
  tiersEnabled: boolean;

  /**
   * Is enabled
   * @example true
   */
  @IsNotEmpty()
  @IsBoolean()
  isEnabled: boolean;

  /**
   * The date of pricing model.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of pricing model.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;

  /**
   * The unit tiers
   * @example []
   */
  @IsArray()
  @Type(() => OemUnitTierEntity)
  unitTiers: OemUnitTierEntity[];

  /**
   * The company
   * @example Company
   */
  @Type(() => Company)
  company: Company;

  /**
   * The array of products
   * @example []
   */
  @IsArray()
  @Type(() => OemProductEntity)
  products: OemProductEntity[];
}

export { PricingModeDto as OemPricingModelDto };
