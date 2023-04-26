import { IsBoolean, IsDate, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PriceTierDto {
  /**
   * The id of Price Tier
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  priceTierId: number;

  /**
   * The id of Unit Tier
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  unitTierId: number;

  /**
   * The id of Product
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  /**
   * The cogs unit
   * @example 99
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cogsUnit: number;

  /**
   * The price unit
   * @example 99
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  priceUnit: number;

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
}

export { PriceTierDto as OemPriceTierDto };
