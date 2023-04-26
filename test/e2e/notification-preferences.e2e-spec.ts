import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import {
  factory,
  runSeeder,
  tearDownDatabase,
  useRefreshDatabase,
  useSeeding,
} from 'typeorm-seeding';
import { AuthGuard } from '@nestjs/passport';
import { useContainer } from 'class-validator';
import * as _ from 'lodash';

import { AppModuleTestConfig } from '../app.module.test.config';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { OemNotificationPreference } from '../oem/main/oem-notification-preferences/oem-notification-preference.entity';
import { OemNotificationPreferenceSerializeDto } from '../oem/main/oem-notification-preferences/oem-notification-preference.dto/oem-notification-preference.serialize.dto';
import { OemCompanyEntity } from '../oem/main/oem-companies/oem-company.entity';
import { OemUserEntity } from '../oem/main/oem-users/oem-user.entity';
import { OemNotificationFrequencyType } from '../oem/main/oem-notification-preferences/oem-notification-preference.enums/oem-notification-preference.frequency-type.enum';

import CreateOemCompanies from '../oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../oem/seeds/create-oem-roles.seed';
import CreateOemHierarchyLevels from '../oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../oem/seeds/create-oem-hierarchies.seed';
import CreateOemUsers from '../oem/seeds/create-oem-users.seed';
import { clearDB } from '../utils/clear-db.util';
import { initPolicy } from '../test.utils/init-policy.util';
import initModuleFixture from '../test.utils/init-module-fixture.util';

describe('NotificationPreferencesController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;

  let company: OemCompanyEntity;
  let user: OemUserEntity;

  let notificationPreference: OemNotificationPreference;

  let comparedData: any;
  const EntityClass = OemNotificationPreference;
  const SerializeClass = OemNotificationPreferenceSerializeDto;
  const PATH = '/notification-preferences';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'notification preference';
  const MODEL_ID = 'userId';

  let PUT_DATA: OemNotificationPreferenceSerializeDto;
  let PATCH_DATA: OemNotificationPreferenceSerializeDto;

  const getMetaData = (method: string) => {
    const expectedStatus: number = ['get', 'patch', 'put'].includes(method)
      ? 200
      : 404;
    let action: string;
    switch (method) {
      case 'post':
        action = 'return';
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
        action = 'return';
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
    company = await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    user = await runSeeder(CreateOemUsers);
    notificationPreference = await factory(OemNotificationPreference)({
      companyId: company.companyId,
      senderId: user.userId,
    }).make();
    comparedData = _.omit(notificationPreference, ['createdAt', 'updatedAt']);
    PATCH_DATA = {
      changeFrequencyType: OemNotificationFrequencyType.DAILY,
      dailyFrequencyValue: '08:30 AM',
    };
    PUT_DATA = {
      companyId: company.companyId,
      userId: user.userId,
    };

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
    it(`should ${getMetaData(method).action} error`, async () => {
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send(comparedData)
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body);
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      comparedData = await factory(EntityClass)().make();

      const res = await request(server)
        [method](PATH + '/' + comparedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send({ ...comparedData, ...PUT_DATA })
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body);

      expect(res.body.data).toEqual(
        expect.objectContaining(
          new SerializeClass({ ...comparedData, ...PUT_DATA }),
        ),
      );

      comparedData = res.body.data;
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[MODEL_ID])
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
        [method](PATH + '/' + comparedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send({ ...PATCH_DATA })
        .expect(getMetaData(method).expectedStatus);

      expect(res.body.data).toEqual(expect.objectContaining({ ...PATCH_DATA }));
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} error`, async () => {
      return request(server)
        [method](PATH + '/' + comparedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);
    });
  });
});
