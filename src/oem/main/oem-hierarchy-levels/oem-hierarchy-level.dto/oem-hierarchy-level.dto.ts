import { Company } from '../../oem-companies/oem-company.entity';
import { OemHierarchyEntity } from '../../oem-hierarchies/oem-hierarchy.entity';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HierarchyTypeEnum } from '../oem-hierarchy-level.enums/hierarchy-type.enum';

export class HierarchyLevelDto {
  /**
   * The id of Hierarchy Level
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  hierarchyLevelId: number;

  /**
   * The id of Company
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  /**
   * The name of Hierarchy
   * @example 'GEO - 1'
   */
  @IsString()
  @MaxLength(128)
  @IsNotEmpty()
  levelName: string;

  /**
   * The name of Hierarchy Type
   * @example 'User Geography'
   */
  @IsNotEmpty()
  @IsEnum(HierarchyTypeEnum)
  hierarchyType: HierarchyTypeEnum;

  /**
   * The level
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(999)
  level: number;

  /**
   * Is enabled
   * @example true
   */
  @IsBoolean()
  isEnabled: boolean;

  /**
   * Is active
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  /**
   * Is editable
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  isEditable: boolean;

  /**
   * The date of updating hierarchy.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  createdAt: Date | string;

  /**
   * The date of updating hierarchy.
   * @example "Thu 10 Aug 2022 15:31:50 UTC +00:00"
   */
  @IsDate()
  updatedAt: Date | string;

  /**
   * The hierarchies
   * @example []
   */
  @IsArray()
  @Type(() => OemHierarchyEntity)
  hierarchies: OemHierarchyEntity[];

  /**
   * The company
   * @example Company
   */
  @Type(() => Company)
  company: Company;
}

export { HierarchyLevelDto as OemHierarchyLevelDto };
