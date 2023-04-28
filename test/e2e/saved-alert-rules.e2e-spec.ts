import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';

import { factory, runSeeder, useSeeding } from 'typeorm-seeding';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { useContainer } from 'class-validator';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import { OemSavedAlertRule } from '../../src/oem/main/oem-rules/oem-saved-alert-rules/oem-saved-alert-rule.entity';
import { OemSavedAlertRuleSerializeDto } from '../../src/oem/main/oem-rules/oem-saved-alert-rules/oem-saved-alert-rule.dto/oem-saved-alert-rule.serialize.dto';
import { initPolicy } from '../test.utils/init-policy.util';
import initModuleFixture from '../test.utils/init-module-fixture.util';

describe('SavedAlertRulesController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;

  // dynamic data
  const entityData: any = OemSavedAlertRule;
  const SerializeClass: any = OemSavedAlertRuleSerializeDto;
  let receivedData: OemSavedAlertRuleSerializeDto;
  let comparedData: any;

  const PATH = '/saved-alert-rules';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'saved-alert-rule';
  const MODEL_ID = 'savedAlertRuleId';
  const PATCH_TEST = { name: 'Test' };

  const getMetaData = (method: string) => {
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

  beforeAll(async () => {
    await initPolicy();
    await useSeeding();
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();

    await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemUsers);
    comparedData = await factory(OemSavedAlertRule)().make();
    await app.init();
    server = app.getHttpServer();
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
        .send(PATCH_TEST)
        .expect(getMetaData(method).expectedStatus);

      expect(res.body.data).toEqual(expect.objectContaining(PATCH_TEST));
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      comparedData = await factory(entityData)().make();
      const res = await request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send(comparedData)
        .expect(getMetaData(method).expectedStatus);

      expect(res.body.data).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
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
      expect(res.body.data.name).toEqual(`Cloned from ${comparedData.name}`);
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
