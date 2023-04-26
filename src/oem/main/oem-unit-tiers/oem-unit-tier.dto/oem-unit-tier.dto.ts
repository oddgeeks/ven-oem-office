import { OemPricingModelEntity } from '../../oem-pricing-models/oem-pricing-model.entity';
import { OemPriceTierEntity } from '../../oem-price-tiers/oem-price-tier.entity';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsNull } from 'typeorm';

export class UnitTierDto {
  /**
   * The id of Unit Tier
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  unitTierId: number;

  /**
   * The id of Pricing Model
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  pricingModelId: number;

  /**
   * The name of Unit Tier
   * @example 1
   */
  @IsString()
  @MaxLength(128)
  @IsNotEmpty()
  unitTierName: string;

  /**
   * The start range
   * @example 0
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  startRange: number;

  /**
   * The end range
   * @example 99
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  endRange: number;

  /**
   * Is enabled
   * @example true
   */
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
   * The pricing model
   * @example Pricing Model
   */
  @Type(() => OemPricingModelEntity)
  pricingModel: OemPricingModelEntity;

  /**
   * The price tiers
   * @example Price Tiers
   */
  @IsArray()
  @Type(() => OemPriceTierEntity)
  priceTiers: OemPriceTierEntity[];
}

export { UnitTierDto as OemUnitTierDto };
