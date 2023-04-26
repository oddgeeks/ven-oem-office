import { PackagePositionEnum } from '../oem-material.enums/package-position.enum';
import { ApplicableToEnum } from '../oem-material.enums/applicable-to.enum';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class MaterialDto {
  /**
   * The id of Material
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  materialId: number;

  /**
   * The name of Material
   * @example 1
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  materialName: string;

  /**
   * The file URL
   * @example http://images.vendori.com/file.png
   */
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(1024)
  fileUrl: string;

  /**
   * Is required
   * @example true
   */
  @IsBoolean()
  isRequired: boolean;

  /**
   * The package position
   * @example Before Quote
   */
  @IsNotEmpty()
  @IsEnum(PackagePositionEnum)
  packagePosition: PackagePositionEnum;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * The date of creating material.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of updating material.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;

  /**
   * Applicable to
   * @example Quote
   */
  @IsNotEmpty()
  @IsEnum(ApplicableToEnum)
  applicableTo: ApplicableToEnum;

  /*@OneToMany(
    () => OemQuotesMaterials,
    (oemQuotesMaterials) => oemQuotesMaterials.material,
  )
  quotesMaterials: OemQuotesMaterials[];

  @OneToMany(
    () => OemVendosMaterials,
    (oemVendosMaterials) => oemVendosMaterials.material,
  )
  vendosMaterials: OemVendosMaterials[];*/
}
export { MaterialDto as OemMaterialDto };
