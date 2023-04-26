import { define } from 'typeorm-seeding';
import { Hierarchy } from './oem-hierarchy.entity';

interface Context {
  companyId?: number;
  hierarchyLevelId?: number;
  parentId?: number;
  hierarchyName?: string;
  isEnabled?: boolean;
  isActive?: boolean;
}

define(Hierarchy, (faker_, context: Context) => {
  const hierarchy: Hierarchy = new Hierarchy();

  hierarchy.companyId = context?.companyId || 1;
  hierarchy.hierarchyLevelId = context?.hierarchyLevelId || 1;
  hierarchy.parentId = context?.parentId || 1;
  hierarchy.hierarchyName = context?.hierarchyName || 'Continent';
  hierarchy.isEnabled = context?.isEnabled || true;
  hierarchy.isActive = context?.isActive || true;

  return hierarchy;
});
