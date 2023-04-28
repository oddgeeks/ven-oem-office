import { TestingModule } from '@nestjs/testing';
import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import { METHODS } from '../test.enums/methods.enum';

import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { OemRoleEntity } from '../../src/oem/main/oem-roles/oem-role.entity';
import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { OemUserSerializeDto } from '../../src/oem/main/oem-users/oem-user.dto/oem-user.serialize.dto';
import { useContainer } from 'class-validator';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import { RoleTypeEnum } from '../../src/oem/main/oem-roles/oem-role.enums/role-type.enum';
import { FunctionTypeEnum } from '../../src/oem/main/oem-roles/oem-role.enums/function-type.enum';
import { DataAccessEnum } from '../../src/oem/main/oem-roles/oem-role.enums/data-access.enum';
import { CreateAccessEnum } from '../../src/oem/main/oem-roles/oem-role.enums/create-access.enum';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';
import { initDefer } from '../../src/utils/init-defer.util';
import { getMetaData } from '../test.utils/get-metadata.util';
import { initTestDescription } from '../test.utils/init-test.util';
import { ActionLogTypeEnum } from '../../src/oem/main/oem-action-logs/oem-action-log.enums/action-log-types.enum';

describe('UsersRolesController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  const deferServer = initDefer();
  let server: Promise<HttpServer> = deferServer.get();
  let role: OemRoleEntity;
  let company: OemCompanyEntity;
  let receivedData: OemUserSerializeDto;
  let comparedData: any;
  const EntityClass = OemRoleEntity;
  const SerializeClass = OemUserSerializeDto;
  const PATH = '/user-roles';
  const PATH_PRIORITIES = '/approval-queue-priorities';

  const MODEL = 'role';

  const PATCH_DATA = {
    roleType: RoleTypeEnum.WORKFLOW_APPROVER,
  };

  const PUT_DATA = {
    roleType: RoleTypeEnum.QUOTE_CREATOR,
    functionType: FunctionTypeEnum.ADMIN,
    roleName: 'Admin2',
    priority: 9,
  };

  const DESCRIBE_ACTION_LOGS_GET = initTestDescription({
    httpServer: deferServer.get(),
    method: METHODS.GET,
    path: '/action-logs',
  });

  beforeAll(async (done) => {
    await initPolicy();
    await useSeeding();
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();
    company = await runSeeder(CreateOemCompanies);
    role = await factory(OemRoleEntity)().make({
      roleId: 1,
    });
    comparedData = {
      roleName: 'Test 12',
      priority: 1,
      roleType: RoleTypeEnum.QUOTE_CREATOR,
      dataAccess: DataAccessEnum.ASSIGNED_ONLY,
      createAccess: CreateAccessEnum.VIEW_ONLY,
      isActive: true,
      isExportRight: false,
    }; //role;
    await app.init();
    server = app.getHttpServer();
    deferServer.resolve(server);
    done();
  });

  afterAll(async () => {
    await clearDB();
    //tearDownDatabase() close connection ONLY for last created
    //await tearDownDatabase();
    getConnectionManager().connections.map(
      async (i) => await getConnection(i.name).close(),
    );

    await app.close();
    global.gc && global.gc();
  });

  describe(`${METHODS.POST.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.POST;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send(comparedData)
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(new SerializeClass(comparedData)),
          );
          receivedData = res.body.data;
          done();
        });
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + receivedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(new SerializeClass(comparedData)),
          );
          done();
        });
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} ${MODEL}s`, (done) => {
      return request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data[0]).toEqual(
            expect.objectContaining(new SerializeClass(comparedData)),
          );
          done();
        });
    });
  });

  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + receivedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...PATCH_DATA })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining({ ...PATCH_DATA }),
          );
          done();
        });
    });
  });

  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + receivedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...PATCH_DATA })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining({ ...PATCH_DATA }),
          );
          done();
        });
    });
  });

  DESCRIBE_ACTION_LOGS_GET({
    type: ActionLogTypeEnum.ROLE,
    association: expect.objectContaining({
      ...PATCH_DATA,
    }),
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH_PRIORITIES}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} approval-priorities`, (done) => {
      return request(server)
        [method](PATH_PRIORITIES)
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data[0]).toEqual(
            expect.objectContaining({ roleId: receivedData[`${MODEL}Id`] }),
          );
          done();
        });
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async (done) => {
      comparedData = await factory(EntityClass)().make({
        roleId: 1,
      });
      const res = await request(server)
        [method](PATH + '/' + receivedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...comparedData, ...PUT_DATA });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data).toEqual(
        expect.objectContaining(
          new SerializeClass({ ...comparedData, ...PUT_DATA }),
        ),
      );
      done();
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async (done) => {
      const res = await request(server)
        [method](PATH + '/' + receivedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      done();
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH_PRIORITIES}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} approval-priorities`, (done) => {
      return request(server)
        [method](PATH_PRIORITIES)
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual([]);
          done();
        });
    });
  });
});
