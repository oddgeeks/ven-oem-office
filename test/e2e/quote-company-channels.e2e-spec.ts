import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';
import { enable } from 'async-local-storage';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { clearDB } from '../../src/utils/clear-db.util';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';

import { OemCompanyChannel } from '../../src/oem/intermediaries/_oem-company-channels/oem-company-channel.entity';
import { OemQuoteCompanyChannel } from '../../src/oem/intermediaries/_oem-quote-company-channels/oem-quote-company-channel.entity';
import { OemQuoteCompanyChannelSerializelDto } from '../../src/oem/intermediaries/_oem-quote-company-channels/oem-quote-company-channel.dto.ts/oem-quote-company-channel.serialize.dto';
import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import CreateOemChannels from '../../src/oem/seeds/create-oem-channels.seed';
import CreateOemLicensingPrograms from '../../src/oem/seeds/create-oem-licensing-programs.seed';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import CreateOemCompanyPrograms from '../../src/oem/seeds/create-oem-company-programs.seed';
import CreateOemQuotes from '../../src/oem/seeds/create-oem-quotes.seed';
import CreateOemCompanyChannels from '../../src/oem/seeds/create-oem-company-channels.seed';

describe('QuoteCompanyChannelsController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let companyChannel: OemCompanyChannel;
  let quoteCompanyChannel: OemQuoteCompanyChannel;

  const MODEL = 'quoteCompanyChannel';
  const RELATION_MODEL_ID = 'companyChannelId';

  // dynamic data
  const SerializeClass = OemQuoteCompanyChannelSerializelDto;
  let receivedData: OemQuoteCompanyChannelSerializelDto;
  let comparedData: OemQuoteCompanyChannelSerializelDto;

  const PATH = '/quotes/1/company-channels';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };

  const PATCH_DATA = { isActive: false };

  const getMetaData = (method: string) => {
    const expectedStatus: number = method === 'post' ? 404 : 200;
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
    enable();

    await initPolicy();
    await useSeeding();

    await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemChannels);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemCustomer);
    await runSeeder(CreateOemUsers);
    await runSeeder(CreateOemLicensingPrograms);
    await runSeeder(CreateOemCompanyPrograms);
    companyChannel = await runSeeder(CreateOemCompanyChannels);
    await runSeeder(CreateOemQuotes);
    quoteCompanyChannel = await factory(OemQuoteCompanyChannel)().make();
    comparedData = quoteCompanyChannel;

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
    //tearDownDatabase() close connection ONLY for last created
    //await tearDownDatabase();
    getConnectionManager().connections.map(
      async (i) => await getConnection(i.name).close(),
    );

    await app.close();
    global.gc && global.gc();
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + companyChannel[RELATION_MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send(comparedData);
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
      receivedData = res.body.data;
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} ${MODEL}s`, async () => {
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost');
      // console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data[0]).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
    });

    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + receivedData[RELATION_MODEL_ID])
        .set('Origin', 'demo.localhost');
      // console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data[0]).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
    });
  });

  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + receivedData[RELATION_MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send(PATCH_DATA);
      // console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data).toEqual(expect.objectContaining(PATCH_DATA));
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + receivedData[RELATION_MODEL_ID])
        .set('Origin', 'demo.localhost');
      // console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });
});
