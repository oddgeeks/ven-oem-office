import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { Role } from '../main/oem-roles/oem-role.entity';
import { RoleTypeEnum } from '../main/oem-roles/oem-role.enums/role-type.enum';
import { CreateAccessEnum } from '../main/oem-roles/oem-role.enums/create-access.enum';
import { DataAccessEnum } from '../main/oem-roles/oem-role.enums/data-access.enum';
import { FunctionTypeEnum } from '../main/oem-roles/oem-role.enums/function-type.enum';
// TODO: we should provide a solution to be able seeds data with attached context
export default (context?) => {
  return class CreateOemRoles implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      context = context || { companyId: 1 };
      await factory(Role)(context).create({
        roleName: 'Admin',
        priority: 1,
        roleType: RoleTypeEnum.ADMIN,
        createAccess: CreateAccessEnum.ALL,
        dataAccess: DataAccessEnum.ALL,
        functionType: FunctionTypeEnum.ADMIN,
      });
      const role = await factory(Role)(context).create({
        roleName: 'Sales',
        priority: 2,
        roleType: RoleTypeEnum.WORKFLOW_APPROVER,
        createAccess: CreateAccessEnum.ALL,
        dataAccess: DataAccessEnum.ALL,
        functionType: FunctionTypeEnum.SALES,
      });
      await factory(Role)(context).create({
        companyId: 1,
        priority: 3,
        roleName: 'Workflow 1',
        roleType: RoleTypeEnum.QUOTE_CREATOR,
        createAccess: CreateAccessEnum.ALL,
        dataAccess: DataAccessEnum.ALL,
      });
      await factory(Role)(context).create({
        roleName: 'Channel 1',
        priority: 4,
        roleType: RoleTypeEnum.CHANNEL_MANAGER,
        createAccess: CreateAccessEnum.ALL,
        dataAccess: DataAccessEnum.ALL,
      });
      await factory(Role)(context).create({
        roleName: 'Channel External',
        priority: 5,
        roleType: RoleTypeEnum.QUOTE_CREATOR, // CHANNEL_MANAGER,
        createAccess: CreateAccessEnum.ALL,
        dataAccess: DataAccessEnum.ASSIGNED_ONLY,
        functionType: FunctionTypeEnum.CHANNEL,
        isExportRight: true,
      });
      return role;
    }
  };
};
