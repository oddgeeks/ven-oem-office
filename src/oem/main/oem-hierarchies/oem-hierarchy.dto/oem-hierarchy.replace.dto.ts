import { OmitType } from '@nestjs/swagger';
import { HierarchyDto } from './oem-hierarchy.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class HierarchyReplaceDto extends OmitType(HierarchyDto, [
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
] as const) {}

export { HierarchyReplaceDto as OemHierarchyReplaceDto };
