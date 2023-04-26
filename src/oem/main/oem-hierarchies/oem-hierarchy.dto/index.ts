import { HierarchyCreateDto } from './oem-hierarchy.create.dto';
import { HierarchyUpdateDto } from './oem-hierarchy.update.dto';
import { HierarchyReplaceDto } from './oem-hierarchy.replace.dto';
import { HierarchySerializeDto } from './oem-hierarchy.serialize.dto';

export const dto = {
  create: HierarchyCreateDto,
  update: HierarchyUpdateDto,
  replace: HierarchyReplaceDto,
};

export const serialize = {
  get: HierarchySerializeDto,
  getMany: HierarchySerializeDto,
};
