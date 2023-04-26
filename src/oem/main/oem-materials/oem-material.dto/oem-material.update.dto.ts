import { OmitType } from '@nestjs/swagger';
import { OemMaterialDto } from './oem-material.dto';
import { IsOptional } from 'class-validator';
import { PackagePositionEnum } from '../oem-material.enums/package-position.enum';
import { ApplicableToEnum } from '../oem-material.enums/applicable-to.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class MaterialUpdateDto extends OmitType(OemMaterialDto, [
  'materialId',
  'isEnabled',
  'createdAt',
  'updatedAt',
] as const) {
  @IsOptional()
  materialName: string;
  @IsOptional()
  fileUrl: string;
  @IsOptional()
  isRequired: boolean;
  @IsOptional()
  packagePosition: PackagePositionEnum;
  @IsOptional()
  applicableTo: ApplicableToEnum;
}

export { MaterialUpdateDto as OemMaterialUpdateDto };
