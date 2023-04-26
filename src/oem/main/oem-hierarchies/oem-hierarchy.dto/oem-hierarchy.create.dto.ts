import { OmitType } from '@nestjs/swagger';
import { OemHierarchyDto } from './oem-hierarchy.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class HierarchyCreateDto extends OmitType(OemHierarchyDto, [
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

export { HierarchyCreateDto as OemCustomerCreateDto };
