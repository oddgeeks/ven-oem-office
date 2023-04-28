import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';
import * as _ from 'lodash';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';

import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { OemQuoteAndVendoUuid } from '../../src/oem/intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuid.entity';
import { OemQuoteAndVendoUuidSerializeDto } from '../../src/oem/intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuid.dto/oem-quote-and-vendo-uuid.serialize.dto';
import { UuidTypesEnum } from '../../src/oem/intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo.enums/uuid-types.enum';
import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import { initPolicy } from '../test.utils/init-policy.util';
import initModuleFixture from '../test.utils/init-module-fixture.util';

describe('QuoteAndVendoUuidsController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let company: OemCompanyEntity;
  let comparedData: OemQuoteAndVendoUuidSerializeDto;
  const PATH = '/quote-and-vendo-uuids';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'quoteAndVendoUuid';

  const PATCH_DATA = {
    lastUuid: 1,
  };

  let PUT_DATA: OemQuoteAndVendoUuidSerializeDto;

  const getMetaData = (method: string) => {
    let action: string;
    let expectedStatus: number;
    switch (method) {
      case 'post':
        action = 'return error';
        expectedStatus = 404;
        break;
      case 'get':
        action = 'retrieve';
        expectedStatus = 200;
        break;
      case 'patch':
        action = 'return error';
        expectedStatus = 404;
        break;
      case 'put':
        action = 'replace';
        expectedStatus = 200;
        break;
      case 'delete':
        action = 'return error';
        expectedStatus = 404;
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
    const quoteAndVendoUuid = await factory(OemQuoteAndVendoUuid)({
      quoteAndVendoUuidType: UuidTypesEnum.QUOTE,
      companyId: company.companyId,
      prefix: 'Q-',
      lastUuid: 1,
    }).create();
    comparedData = _.omit(quoteAndVendoUuid, ['createdAt', 'updatedAt']);
    PUT_DATA = {
      quoteAndVendoUuidType: UuidTypesEnum.QUOTE,
      companyId: company.companyId,
      prefix: 'Q-',
      lastUuid: 2,
    };

    await app.init();
    server = app.getHttpServer();
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
    it(`should ${getMetaData(method).action} error`, async () => {
      return request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send(comparedData)
        .expect(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData.quoteAndVendoUuidType)
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);
      expect(res.body.data).toEqual(expect.objectContaining(comparedData));
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action}`, async () => {
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);
      expect(res.body.data[0]).toEqual(expect.objectContaining(comparedData));
    });
  });

  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action}`, async () => {
      return request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...PATCH_DATA })
        .expect(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + PUT_DATA.quoteAndVendoUuidType)
        .set('Origin', 'demo.localhost')
        .send(PUT_DATA)
        .end((_, res) => {
          console.debug(res.body);
          expect(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(expect.objectContaining(PUT_DATA));
          done();
        });
    });

    it('should return error with the lastUuid less than the current sequence', async () => {
      const res = await request(server)
        [method](PATH + '/' + PUT_DATA.quoteAndVendoUuidType)
        .set('Origin', 'demo.localhost')
        .send({
          ...PUT_DATA,
          lastUuid: PUT_DATA.lastUuid - 1,
        });

      console.debug(res.body);
      expect(res.body.status).toEqual(400);
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} error`, async () => {
      return request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);
    });
  });
});
