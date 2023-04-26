import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { enable } from 'async-local-storage';
import { ExecutionContext, Logger } from '@nestjs/common';

import { AppModuleTestConfig } from '../app.module.test.config';
import { SessionAuthGuard } from '../../src/auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { DataAccessEnum } from '../../src/oem/main/oem-roles/oem-role.enums/data-access.enum';
import { CreateAccessEnum } from '../../src/oem/main/oem-roles/oem-role.enums/create-access.enum';
import { RoleTypeEnum } from '../../src/oem/main/oem-roles/oem-role.enums/role-type.enum';
import { JWTAuthExternalGuard } from '../../src/auth/guards/jwt-auth-external.guard';

enable();

const TEST_USER = {
  companyId: 1,
  userId: 1,
  geoHierarchyId: 1,
  role: {
    roleId: 1,
    dataAccess: DataAccessEnum.ALL,
    roleType: RoleTypeEnum.ADMIN,
    createAccess: CreateAccessEnum.ALL,
  },
};

export default function initModuleFixture(): TestingModuleBuilder {
  return Test.createTestingModule({
    imports: [AppModuleTestConfig],
    controllers: [],
    providers: [Logger],
  })
    .overrideProvider(Logger)
    .useValue({
      log: jest.fn(),
      verbose: jest.fn(),
    })
    .overrideGuard(SessionAuthGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = {
          ...TEST_USER,
        };
        return true;
      },
    })
    .overrideGuard(JWTAuthGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = {
          ...TEST_USER,
        };
        return true;
      },
    })
   /* .overrideGuard(JWTAuthExternalGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = {
          ...TEST_USER,
        };
        return true;
      },
    });*/
  //.compile();
}
