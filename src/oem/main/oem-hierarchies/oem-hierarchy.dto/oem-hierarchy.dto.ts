import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Company } from '../../oem-companies/oem-company.entity';
import { OemHierarchyLevelEntity } from '../../oem-hierarchy-levels/oem-hierarchy-level.entity';
import { OemProductEntity } from '../../oem-products/oem-product.entity';
import { OemUserEntity } from '../../oem-users/oem-user.entity';
import { OemHierarchyEntity } from '../oem-hierarchy.entity';
import { OemCompanyChannel } from '../../../intermediaries/_oem-company-channels/oem-company-channel.entity';

export class HierarchyDto {
  /**
   * The id of Hierarchy
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  hierarchyId: number;

  //TODO: Validation for hierarchy type (accept ether geo or product). Should be added for other endpoints also.
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
   * The id of Hierarchy
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  parentId: number;

  /**
   * The name of Hierarchy
   * @example 'GEO - 1'
   */
  @IsString()
  @MaxLength(128)
  @IsNotEmpty()
  hierarchyName: string;

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
  isActive: boolean;

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
   * The company
   * @example Company
   */
  @Type(() => Company)
  company: Company;

  /**
   * The hierarchy level
   * @example Hierarchy Level
   */
  @Type(() => OemHierarchyLevelEntity)
  hierarchyLevel: OemHierarchyLevelEntity;

  /**
   * The hierarchy parent
   * @example Hierarchy Level
   */
  @Type(() => OemHierarchyEntity)
  parent: OemHierarchyEntity;

  /**
   * The hierarchies
   * @example []
   */
  @IsArray()
  @Type(() => OemHierarchyEntity)
  hierarchies: OemHierarchyEntity[];

  /**
   * The products
   * @example []
   */
  @IsArray()
  @Type(() => OemProductEntity)
  products: OemProductEntity[];

  /**
   * The users
   * @example []
   */
  @IsArray()
  @Type(() => OemUserEntity)
  users: OemUserEntity[];

  /**
   * The company channels
   * @example []
   */
  @IsArray()
  @Type(() => OemCompanyChannel)
  companyChannels: OemCompanyChannel[];
}

export { HierarchyDto as OemHierarchyDto };
