import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { useContainer } from 'class-validator';
import { enable } from 'async-local-storage';
import { getConnection, getConnectionManager } from 'typeorm';
import { runSeeder, useSeeding } from 'typeorm-seeding';

import { AppModuleTestConfig } from '../app.module.test.config';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';

import { SessionAuthGuard } from '../../src/auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { initPolicy } from '../test.utils/init-policy.util';
import { clearDB } from '../../src/utils/clear-db.util';

import { OemUserEntity } from '../../src/oem/main/oem-users/oem-user.entity';
import { RoleTypeEnum } from '../../src/oem/main/oem-roles/oem-role.enums/role-type.enum';
import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import CreateOemCompanies from '../../src/oem/seeds/demo/create-demo-oem-companies.seed';

describe('SettingsController (e2e)', () => {
  const logger = new Logger('OemSettingsService');

  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;

  const PATH = '/settings';

  const TEST_USER = {
    companyId: 1,
    userId: 1,
    geoHierarchyId: 1,
  };

  beforeAll(async () => {
    enable();
    await initPolicy();
    await useSeeding();
    await runSeeder(CreateOemCompanies({}));

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModuleTestConfig],
      controllers: [],
      providers: [],
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
      .setLogger(logger)
      .compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await clearDB();
    getConnectionManager().connections.map(
      async (c) => await getConnection(c.name).close(),
    );
    await app.close();
  });

  describe(`POST ${PATH}/reset-env`, () => {
    const originalEnv = process.env.NODE_ENV;

    beforeAll(async () => {
      process.env.NODE_ENV = 'demo';
    });

    afterAll(async () => {
      process.env.NODE_ENV = originalEnv;
    });

    it(`should reset demo env`, async () => {
      process.env.NODE_ENV = 'mock';

      const connection = getConnection('MASTER_CONNECTION_CONF');
      await connection.manager.update(
        OemCompanyEntity,
        { companyId: 1 },
        { companyName: 'Mock Co.', subdomain: 'mock' },
      );

      const res = await request(server)
        .post(`${PATH}/reset-env`)
        .set('Origin', 'mock.localhost')
        .set('Host', 'api-mock-oem.vendori.com');

      expect(res.status).toBe(201);

      const company = await connection.manager.findOne(OemCompanyEntity, {});
      expect(company.companyName).toEqual('Mock Co.');
      expect(company.subdomain).toEqual('mock');

      const users = await connection.manager.find(OemUserEntity, {
        relations: ['role'],
        order: {
          userId: 'ASC',
        },
      });

      // only 1 admin user
      expect(users).toHaveLength(1);
      expect(users[0].role.roleType).toEqual(RoleTypeEnum.ADMIN);
    });

    it(`should reset demo env`, async () => {
      process.env.NODE_ENV = 'demo';

      const connection = getConnection('MASTER_CONNECTION_CONF');
      await connection.manager.update(
        OemCompanyEntity,
        { companyId: 1 },
        { companyName: 'Demo & Co.', subdomain: 'demo' },
      );

      const res = await request(server)
        .post(`${PATH}/reset-env`)
        .set('Origin', 'demo.localhost')
        .set('Host', 'api-demo-oem.vendori.com');

      expect(res.status).toBe(201);

      const company = await connection.manager.findOne(OemCompanyEntity, {});
      expect(company.companyName).toEqual('Demo & Co.');
      expect(company.subdomain).toEqual('demo');

      const users = await connection.manager.find(OemUserEntity, {
        relations: ['role'],
        order: {
          userId: 'ASC',
        },
      });

      // only 1 admin user
      expect(users).toHaveLength(1);
      expect(users[0].role.roleType).toEqual(RoleTypeEnum.ADMIN);
    });

    it(`should reset staging env`, async () => {
      process.env.NODE_ENV = 'staging';

      const connection = getConnection('MASTER_CONNECTION_CONF');
      await connection.manager.update(
        OemCompanyEntity,
        { companyId: 1 },
        { companyName: 'Staging', subdomain: 'staging' },
      );

      const res = await request(server)
        .post(`${PATH}/reset-env`)
        .set('Origin', 'staging.localhost')
        .set('Host', 'api-staging-oem.vendori.com');
      // console.debug(res.body);
      expect(res.status).toBe(201);

      const company = await connection.manager.findOne(OemCompanyEntity, {});
      expect(company.companyName).toEqual('Staging');
      expect(company.subdomain).toEqual('staging');

      const users = await connection.manager.find(OemUserEntity, {
        relations: ['role'],
        order: {
          userId: 'ASC',
        },
      });

      // only 1 admin user
      expect(users).toHaveLength(1);
      expect(users[0].role.roleType).toEqual(RoleTypeEnum.ADMIN);
    });
  });
});
