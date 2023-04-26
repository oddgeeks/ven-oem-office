import { OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { HierarchyDto } from './oem-hierarchy.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class HierarchyUpdateDto extends OmitType(HierarchyDto, [
  'hierarchyId',
  'company',
  'companyId',
  'hierarchyLevel',
  'parent',
  'hierarchies',
  'products',
  'users',
  'companyChannels',
  'isEnabled',
  'createdAt',
  'updatedAt',
] as const) {
  @IsOptional()
  hierarchyLevelId: number;

  @IsOptional()
  parentId: number;

  @IsOptional()
  hierarchyName: string;

  @IsOptional()
  isActive: boolean;
}

export { HierarchyUpdateDto as OemHierarchyUpdateDto };
