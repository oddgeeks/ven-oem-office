import { HierarchyDto } from './oem-hierarchy.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class HierarchySerializeDto extends OmitType(HierarchyDto, [
  'hierarchyLevel',
  'parent',
  'hierarchies',
] as const) {}

export { HierarchySerializeDto as OemHierarchySerializeDto };
