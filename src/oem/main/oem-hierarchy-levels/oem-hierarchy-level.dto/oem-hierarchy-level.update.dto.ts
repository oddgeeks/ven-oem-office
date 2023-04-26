import { OmitType } from '@nestjs/swagger';
import { HierarchyLevelDto } from './oem-hierarchy-level.dto';
import { IsOptional } from 'class-validator';
import { HierarchyTypeEnum } from '../oem-hierarchy-level.enums/hierarchy-type.enum';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class HierarchyLevelUpdateDto extends OmitType(HierarchyLevelDto, [
  'hierarchyLevelId',
  'hierarchies',
  'company',
  'companyId',
  'isEnabled',
  'createdAt',
  'updatedAt',
] as const) {
  @IsOptional()
  companyId: number;
  @IsOptional()
  levelName: string;
  @IsOptional()
  hierarchyType: HierarchyTypeEnum;
  @IsOptional()
  level: number;
}

export { HierarchyLevelUpdateDto as OemHierarchyLevelUpdateDto };
