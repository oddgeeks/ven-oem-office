import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { OemVacationRule } from '../../src/oem/main/oem-rules/oem-vacation-rules/oem-vacation-rule.entity';
import { OemVacationRuleSerializeDto } from '../../src/oem/main/oem-rules/oem-vacation-rules/oem-vacation-rule.dto/oem-vacation-rule.serialize.dto';
import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { OemUserEntity } from '../../src/oem/main/oem-users/oem-user.entity';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';

describe('VacationRulesController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;

  let company: OemCompanyEntity;
  let user1: OemUserEntity;
  let user2: OemUserEntity;
  let vacationRule: OemVacationRule;

  let receivedData: OemVacationRuleSerializeDto;
  let comparedData: any;
  const SerializeClass = OemVacationRuleSerializeDto;
  const PATH = '/vacation-rules';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'vacation-rule';
  const MODEL_ID = 'vacationRuleId';

  let PUT_DATA: OemVacationRuleSerializeDto;
  let PATCH_DATA: OemVacationRuleSerializeDto;

  const getMetaData = (method: string) => {
    let action: string;
    let expectedStatus: number;

    switch (method) {
      case 'post':
        action = 'create';
        expectedStatus = 201;
        break;
      case 'get':
        action = 'retrieve';
        expectedStatus = 200;
        break;
      case 'patch':
        action = 'update';
        expectedStatus = 200;
        break;
      case 'put':
        action = 'return';
        expectedStatus = 404;
        break;
      case 'delete':
        action = 'delete';
        expectedStatus = 200;
        break;
    }
    return { action, expectedStatus };
  };

  beforeAll(async () => {
    await initPolicy();
    await useSeeding();
    company = await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    user1 = await runSeeder(CreateOemUsers);
    user2 = await runSeeder(CreateOemUsers);
    vacationRule = await factory(OemVacationRule)({
      companyId: company.companyId,
      sourceUserId: user1.userId,
      targetUserId: user2.userId,
    }).make();
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();
    comparedData = vacationRule;
    await app.init();
    server = app.getHttpServer();

    PUT_DATA = {
      companyId: company.companyId,
      name: 'Vacation Rule 2',
      sourceUserId: user1.userId,
      targetUserId: user2.userId,
    };
    PATCH_DATA = {
      name: 'Vacation Rule 3',
      sourceUserId: user2.userId,
      targetUserId: user1.userId,
    };
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
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send(comparedData)
        .expect(getMetaData(method).expectedStatus);

      expect(res.body.data).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
      receivedData = res.body.data;
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);

      expect(res.body.data).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} ${MODEL}s`, async () => {
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);

      expect(res.body.data[0]).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
    });
  });

  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send({ ...PATCH_DATA })
        .expect(getMetaData(method).expectedStatus);

      expect(res.body.data).toEqual(expect.objectContaining({ ...PATCH_DATA }));
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} error`, async () => {
      return request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send({ ...comparedData, ...PUT_DATA })
        .expect(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.POST.toUpperCase()} ${PATH}/:id/clone`, () => {
    const method = METHODS.POST;
    it(`should clone a ${MODEL}`, async () => {
      const res = await request(server)
        [method](`${PATH}/${receivedData[MODEL_ID]}/clone`)
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toEqual(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      return request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);
    });
  });
});
