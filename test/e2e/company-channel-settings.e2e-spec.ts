import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';
import * as _ from 'lodash';

import { AppModuleTestConfig } from '../app.module.test.config';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';

import { OemChannelEntity } from '../../src/oem/main/oem-channels/oem-channel.entity';
import { OemChannelSerializeDto } from '../../src/oem/main/oem-channels/oem-channel.dto/oem-channel.serialize.dto';

import { SessionAuthGuard } from '../../src/auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../src/auth/guards/jwt-auth.guard';

import { enable } from 'async-local-storage';
import { initPolicy } from '../test.utils/init-policy.util';
import { clearDB } from '../../src/utils/clear-db.util';
import { closeAllConnection } from '../test.utils/close-all-connections.util';
import { OemCompanyChannelSetting } from '../../src/oem/intermediaries/_oem-company-channels-settings/oem-company-channel-setting.entity';
import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemChannels from '../../src/oem/seeds/create-oem-channels.seed';
import initModuleFixture from '../test.utils/init-module-fixture.util';

enable();

describe('CompanyChannelSettingsController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let channel: any;
  let comparedData: OemChannelSerializeDto;
  const SerializeClass = OemChannelSerializeDto;
  const PATH = '/company-channel-settings';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'companyChannelSetting';

  const PATCH_DATA = {
    name: 'test',
  };
  const PUT_DATA = {
    name: 'test',
  };

  const TEST_USER = {
    companyId: 1,
    userId: 1,
    geoHierarchyId: 1,
  };

  const getMetaData = (method: string) => {
    let action: string;
    let expectedStatus: number;
    switch (method) {
      case 'post':
        action = 'return';
        expectedStatus = 201;
        break;
      case 'get':
        action = 'retrieve';
        expectedStatus = 200;
        break;
      case 'patch':
        action = 'return';
        expectedStatus = 200;
        break;
      case 'put':
        action = 'return';
        expectedStatus = 200;
        break;
      case 'delete':
        action = 'return';
        expectedStatus = 200;
        break;
    }
    return { action, expectedStatus };
  };

  beforeAll(async () => {
    await initPolicy();
    await useSeeding();
    await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemChannels);
    channel = await factory(OemCompanyChannelSetting)().create();
    comparedData = _.omit(channel, ['createdAt', 'updatedAt']);

    const moduleFixture: TestingModule = await initModuleFixture().compile();

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
    await closeAllConnection();
    await app.close();
    global.gc && global.gc();
  });

  describe(`${METHODS.POST.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.POST;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send(comparedData);
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
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
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data[0]).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
    });
  });

  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} error`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...PATCH_DATA });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} error`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...comparedData, ...PUT_DATA });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} error`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });
});
