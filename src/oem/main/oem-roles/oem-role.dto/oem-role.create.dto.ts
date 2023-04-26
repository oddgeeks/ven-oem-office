import { OmitType } from '@nestjs/swagger';

import { OemRoleDto } from './oem-role.dto';

/**
 * make more clear for swagger DTO (without OEM prefix)
 */
export class RoleCreateDto extends OmitType(OemRoleDto, [
  'roleId',
  'isEnabled',
  'createdAt',
  'updatedAt',
  'company',
  'companyId',
  'users',
  'approvalQueuePriority',
]) {}

export { RoleCreateDto as OemRoleCreateDto };
