import { define } from 'typeorm-seeding';
import { HierarchyLevel } from './oem-hierarchy-level.entity';
import { HierarchyTypeEnum } from './oem-hierarchy-level.enums/hierarchy-type.enum';

interface Context {
  companyId?: number;
  hierarchyType?: HierarchyTypeEnum;
  level?: number;
  levelName?: string;
  isEnabled?: boolean;
  isEditable?: boolean;
  isActive?: boolean;
}

define(HierarchyLevel, (faker_, context: Context) => {
  const hierarchyLevel: HierarchyLevel = new HierarchyLevel();

  hierarchyLevel.companyId = context?.companyId || 1;
  hierarchyLevel.hierarchyType =
    context?.hierarchyType || HierarchyTypeEnum.USER_GEOGRAPHY;
  hierarchyLevel.level = context?.level || 1;
  hierarchyLevel.levelName = context?.levelName || 'GEO LV-1';
  hierarchyLevel.isEnabled = context?.isEnabled || true;
  hierarchyLevel.isEditable = context?.isEditable || true;
  hierarchyLevel.isActive = context?.isActive || true;

  return hierarchyLevel;
});
