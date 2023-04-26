import { HierarchyLevelCreateDto } from './oem-hierarchy-level.create.dto';
import { HierarchyLevelUpdateDto } from './oem-hierarchy-level.update.dto';
import { HierarchyLevelReplaceDto } from './oem-hierarchy-level.replace.dto';
import { HierarchyLevelSerializeDto } from './oem-hierarchy-level.serialze.dto';

export const dto = {
  create: HierarchyLevelCreateDto,
  update: HierarchyLevelUpdateDto,
  replace: HierarchyLevelReplaceDto,
};

export const serialize = {
  get: HierarchyLevelSerializeDto,
  getMany: HierarchyLevelSerializeDto,
};
