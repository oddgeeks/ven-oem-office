import { OmitType } from '@nestjs/swagger';
import { OemHierarchyLevelDto } from './oem-hierarchy-level.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class HierarchyLevelCreateDto extends OmitType(OemHierarchyLevelDto, [
  'hierarchyLevelId',
  'hierarchies',
  'company',
  'companyId',
  'isEnabled',
  'createdAt',
  'updatedAt',
] as const) {}

export { HierarchyLevelCreateDto as OemProductHierarchyLevelCreateDto };
