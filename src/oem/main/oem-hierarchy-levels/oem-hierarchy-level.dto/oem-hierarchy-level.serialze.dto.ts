import { HierarchyLevelDto } from './oem-hierarchy-level.dto';
import { PartialType } from '@nestjs/swagger';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class HierarchyLevelSerializeDto extends PartialType(
  HierarchyLevelDto,
) {}

export { HierarchyLevelSerializeDto as OemHierarchyLevelSerializeDto };
