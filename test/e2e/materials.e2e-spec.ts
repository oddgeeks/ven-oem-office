import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';

import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { HttpExceptionFilter } from '../../src/../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { useContainer } from 'class-validator';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import { OemMaterialEntity } from '../../src/oem/main/oem-materials/oem-material.entity';
import { OemMaterialSerializeDto } from '../../src/oem/main/oem-materials/oem-material.dto/oem-material.serialize.dto';
import initModuleFixture from '../test.utils/init-module-fixture.util';

import { initPolicy } from '../test.utils/init-policy.util';
import { enable } from 'async-local-storage';
import { initTestDescription } from '../test.utils/init-test.util';
import { METHODS } from '../test.enums/methods.enum';
import { initDefer } from '../../src/utils/init-defer.util';
import { ActionLogTypeEnum } from '../../src/oem/main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../src/oem/main/oem-action-logs/oem-action-log.enums/actions.enum';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import { OemUserEntity } from '../../src/oem/main/oem-users/oem-user.entity';

enable();

describe('MaterialController (e2e)', () => {
  jest.setTimeout(5000);
  let app: INestApplication;
  let server: any;
  const deferServer = initDefer();
  let qb: RequestQueryBuilder;
  let company: OemCompanyEntity;
  let user: OemUserEntity;
  let material: OemMaterialEntity;

  const MODEL = 'material';
  const MODEL_ID = `${MODEL}Id`;

  // dynamic data
  const entityData: any = OemMaterialEntity;
  const SerializeClass: any = OemMaterialSerializeDto;
  let receivedData: OemMaterialSerializeDto;
  let comparedData: any;

  const PATH = '/materials';

  const DESCRIBE_ACTION_LOGS_GET = initTestDescription({
    httpServer: deferServer.get(),
    method: METHODS.GET,
    path: '/action-logs?join=Material&join=User',
  });

  const PATCH_TEST = { materialName: 'Test' };

  const getMetaData = (method) => {
    const expectedStatus: number = method === 'post' ? 201 : 200;
    let action: string;
    switch (method) {
      case 'post':
        action = 'create';
        break;
      case 'get':
        action = 'retrieve';
        break;
      case 'patch':
        action = 'update';
        break;
      case 'put':
        action = 'replace';
        break;
      case 'delete':
        action = 'delete';
        break;
    }
    return { action, expectedStatus };
  };

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
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemRoles());
    user = await runSeeder(CreateOemUsers);
    material = await factory(OemMaterialEntity)().make();
    comparedData = material;
    console.debug('comparedData', comparedData);
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

  DESCRIBE_ACTION_LOGS_GET({
    type: ActionLogTypeEnum.MATERIAL,
    action: ActionsEnum.CREATE,
    association: expect.objectContaining({
      ...comparedData,
    }),
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
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
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send(PATCH_TEST)
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(expect.objectContaining(PATCH_TEST));
          done();
        });
    });
  });

  DESCRIBE_ACTION_LOGS_GET({
    type: ActionLogTypeEnum.MATERIAL,
    action: ActionsEnum.CREATE,
    association: expect.objectContaining({
      ...receivedData,
    }),
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async (done) => {
      comparedData = await factory(entityData)().make();
      comparedData.shadingRuleLogic = JSON.stringify(
        comparedData.shadingRuleLogic,
      );
      const res = await request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send(comparedData);
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
      done();
    });
  });

  DESCRIBE_ACTION_LOGS_GET({
    type: ActionLogTypeEnum.MATERIAL,
    action: ActionsEnum.CREATE,
    association: expect.objectContaining({
      ...comparedData,
    }),
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async (done) => {
      const res = await request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      done();
    });
  });

  DESCRIBE_ACTION_LOGS_GET({
    type: ActionLogTypeEnum.MATERIAL,
    action: ActionsEnum.DELETE,
    association: expect.objectContaining({
      ...receivedData,
    }),
    subject: expect.objectContaining({
      ...user,
    }),
  });
});
