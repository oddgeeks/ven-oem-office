import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { enable } from 'async-local-storage';
import { ExecutionContext, Logger } from '@nestjs/common';

import { AppModuleTestConfig } from '../app.module.test.config';
import { SessionAuthGuard } from '../../src/auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { DataAccessEnum } from '../../src/oem/main/oem-roles/oem-role.enums/data-access.enum';
import { CreateAccessEnum } from '../../src/oem/main/oem-roles/oem-role.enums/create-access.enum';
import { RoleTypeEnum } from '../../src/oem/main/oem-roles/oem-role.enums/role-type.enum';
import { IAuthGuard, Type } from '@nestjs/passport';

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

interface IModuleFixtureOptions {
  overrideGuards: Array<Type<IAuthGuard>>;
}

export default function initModuleFixture(
  options: IModuleFixtureOptions = {
    overrideGuards: [SessionAuthGuard, JWTAuthGuard],
  },
): TestingModuleBuilder {
  const testingModule = Test.createTestingModule({
    imports: [AppModuleTestConfig],
    controllers: [],
    providers: [Logger],
  })
    .overrideProvider(Logger)
    .useValue({
      log: jest.fn(),
      verbose: jest.fn(),
    });

  options?.overrideGuards.forEach((guard) => {
    testingModule.overrideGuard(guard).useValue({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = {
          ...TEST_USER,
        };
        return true;
      },
    });
  });
  return testingModule;

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
