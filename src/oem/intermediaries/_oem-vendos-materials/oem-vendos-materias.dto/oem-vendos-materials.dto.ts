import {
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsOptional,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { IsMaterialInapplicable } from '../oem-vendos-materials.validators/oem-vendos-materials.validators';

export class VendosMaterialsDto {
  /**
   * The id of Vendo
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  vendoId: number;

  /**
   * The id of Material
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Validate(IsMaterialInapplicable)
  materialId: number;

  /**
   * The id of company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  companyId: number;

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

export { VendosMaterialsDto as OemVendosMaterialsDto };
