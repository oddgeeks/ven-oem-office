import {
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { IsMaterialInapplicable } from '../oem-quotes-materials.validators/oem-quotes-materials.validators';

export class QuotesMaterialsDto {
  /**
   * The id of Quote
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  quoteId: number;

  /**
   * The id of Material
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Validate(IsMaterialInapplicable)
  materialId: number;

  /*/!**
   * The id of Company
   * @example 1
   *!/
  @IsNumber()
  @IsOptional()
  companyId: number;*/

  /**
   * The position of quote-materials
   * @example 1
   */
  @IsNumber()
  @Min(-100)
  @Max(100)
  @IsNotEmpty()
  @IsNotIn([0])
  position: number;
}

export { QuotesMaterialsDto as OemQuotesMaterialsDto };
