import { OmitType } from '@nestjs/swagger';
import { HierarchyLevelDto } from './oem-hierarchy-level.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class HierarchyLevelReplaceDto extends OmitType(HierarchyLevelDto, [
  'hierarchyLevelId',
  'hierarchies',
  'company',
  'companyId',
  'isEnabled',
  'createdAt',
  'updatedAt',
] as const) {}

export { HierarchyLevelReplaceDto as OemHierarchyLevelReplaceDto };
