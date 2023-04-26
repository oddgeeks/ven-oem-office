import { define } from 'typeorm-seeding';
import { Role } from './oem-role.entity';

import { RoleTypeEnum } from './oem-role.enums/role-type.enum';
import { DataAccessEnum } from './oem-role.enums/data-access.enum';
import { CreateAccessEnum } from './oem-role.enums/create-access.enum';
import { faker } from '@faker-js/faker';

interface Context {
  companyId: number;
  roleName?: string;
  priority?: number;
  roleType?: RoleTypeEnum;
  dataAccess?: DataAccessEnum;
  createAccess?: CreateAccessEnum;
  isActive?: boolean;
  isExportRight?: boolean;
  isEnabled?: boolean;
}

define(Role, (faker_, context: Context) => {
  const role = new Role();

  role.companyId = context?.companyId || 1;
  role.roleName = context?.roleName || faker.name.jobType();
  role.priority = context?.priority || 1;
  role.roleType = context?.roleType || RoleTypeEnum.ADMIN;
  role.dataAccess = context?.dataAccess || DataAccessEnum.ALL;
  role.createAccess = context?.createAccess || CreateAccessEnum.INTERNAL_CREATE;
  role.isActive = context?.isActive || true;
  role.isExportRight = context?.isExportRight || true;
  role.isEnabled = context?.isEnabled || true;

  return role;
});
