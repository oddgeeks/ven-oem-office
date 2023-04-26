import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { OemRoleEntity } from '../../main/oem-roles/oem-role.entity';

import { RoleTypeEnum } from '../../main/oem-roles/oem-role.enums/role-type.enum';
import { FunctionTypeEnum } from '../../main/oem-roles/oem-role.enums/function-type.enum';
import { DataAccessEnum } from '../../main/oem-roles/oem-role.enums/data-access.enum';
import { CreateAccessEnum } from '../../main/oem-roles/oem-role.enums/create-access.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateCleanOemRoles implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const roles: Partial<OemRoleEntity>[] = [
        {
          companyId,
          roleName: 'Admin',
          roleType: RoleTypeEnum.ADMIN,
          functionType: FunctionTypeEnum.ADMIN,
          dataAccess: DataAccessEnum.ALL,
          createAccess: CreateAccessEnum.ALL,
          isActive: true,
          isExportRight: true,
          isEnabled: true,
          priority: 2,
        },
        {
          companyId,
          roleName: 'External',
          roleType: RoleTypeEnum.QUOTE_CREATOR,
          functionType: FunctionTypeEnum.CHANNEL,
          dataAccess: DataAccessEnum.ASSIGNED_ONLY,
          createAccess: CreateAccessEnum.ALL,
          isActive: true,
          isExportRight: false,
          isEnabled: true,
          priority: 3,
        },
        {
          companyId,
          roleName: 'Sales 1',
          roleType: RoleTypeEnum.QUOTE_CREATOR,
          functionType: FunctionTypeEnum.SALES,
          dataAccess: DataAccessEnum.TEAM_SUB_HIERARCHY,
          createAccess: CreateAccessEnum.INTERNAL_CREATE,
          isActive: true,
          isExportRight: false,
          isEnabled: true,
          priority: 4,
        },
      ];

      const roleEntities = await seedEntities(connection, OemRoleEntity, roles);

      return roleEntities;
    }
  };
