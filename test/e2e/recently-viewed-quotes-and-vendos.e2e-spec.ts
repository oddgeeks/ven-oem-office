import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';

import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { OemQuoteAndVendoUuidSerializeDto } from '../../src/oem/intermediaries/_oem-quote-and-vendo-uuids/oem-quote-and-vendo-uuid.dto/oem-quote-and-vendo-uuid.serialize.dto';
import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import { initPolicy } from '../test.utils/init-policy.util';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import CreateOemLicensingPrograms from '../../src/oem/seeds/create-oem-licensing-programs.seed';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';
import CreateOemQuoteCompanyChannels from '../../src/oem/seeds/create-oem-quote-company-channels.seed';
import CreateOemQuotes from '../../src/oem/seeds/create-oem-quotes.seed';
import CreateOemVendos from '../../src/oem/seeds/create-oem-vendos.seed';
import CreateOemChannels from '../../src/oem/seeds/create-oem-channels.seed';
import CreateOemCompanyPrograms from '../../src/oem/seeds/create-oem-company-programs.seed';
import CreateOemCompanyChannels from '../../src/oem/seeds/create-oem-company-channels.seed';

expect.extend({
  toBeDistinct(received) {
    const pass =
      Array.isArray(received) && new Set(received).size === received.length;
    if (pass) {
      return {
        message: () => `expected [${received}] array is unique`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected [${received}] array is not to unique`,
        pass: false,
      };
    }
  },
});

describe('RecentlyViewedQuotesAndVendosController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let company: OemCompanyEntity;
  let comparedData: OemQuoteAndVendoUuidSerializeDto;
  const PATH_QUOTES = '/quotes';
  const PATH_VENDOS = '/vendos';
  const PATH = '/recently-viewed-quotes-vendos';
  const PATH_PRODUCTS = '/quotes-vendos-products';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'quoteAndVendo';

  const PATCH_DATA = {
    lastUuid: 1,
    quoteAndVendoId: 1,
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
        action = 'return';
        expectedStatus = 200;
        break;
      case 'patch':
        action = 'return error';
        expectedStatus = 404;
        break;
      case 'put':
        action = 'return error';
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
    company = await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemUsers);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemCustomer);
    await runSeeder(CreateOemQuotes);
    const vendo = await runSeeder(CreateOemVendos);
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();

    await app.init();
    server = app.getHttpServer();
    done();
  });

  afterAll(async () => {
    await clearDB();
    //tearDownDatabase() close connection ONLY for last created
    //await tearDownDatabase();
    await getConnection('MASTER_CONNECTION_CONF').close();
    await getConnection('MASTER_CONNECTION').close();
    await getConnection().close();
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

  describe(`${METHODS.GET.toUpperCase()} ${PATH_PRODUCTS}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action}`, (done) => {
      return request(server)
        [method](PATH_PRODUCTS + '/')
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          done();
        });
    });
  });

  //checking onDistinct duplication
  describe(`${METHODS.GET.toUpperCase()} ${PATH_QUOTES}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action}`, (done) => {
      return request(server)
        [method](PATH_QUOTES + '/' + '1')
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          done();
        });
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH_QUOTES}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action}`, async () => {
      return request(server)
        [method](PATH_QUOTES + '/' + '1')
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);
    });
  });

  //checking onDistinct duplication in recently viewed
  describe(`${METHODS.GET.toUpperCase()} ${PATH_VENDOS}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action}`, (done) => {
      return request(server)
        [method](PATH_VENDOS + '/')
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          done();
        });
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH_VENDOS}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action}`, (done) => {
      return request(server)
        [method](PATH_VENDOS + '/' + '1')
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          done();
        });
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action}`, (done) => {
      return request(server)
        [method](PATH + '/?join=quote.customer&join=vendo.customer')
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);

          expect(res.body.data.map((item) => item.vendoId))['toBeDistinct']();
          expect(res.body.data.map((item) => item.quoteId))['toBeDistinct']();
          done();
        });
    });
  });

  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} error`, async () => {
      return request(server)
        [method](PATH + '/' + '1')
        .set('Origin', 'demo.localhost')
        .send({ ...PATCH_DATA })
        .expect(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} error`, (done) => {
      return request(server)
        [method](PATH + '/' + '1')
        .set('Origin', 'demo.localhost')
        .send(PUT_DATA)
        .end((_, res) => {
          console.debug(res.body);
          expect(getMetaData(method).expectedStatus);
          done();
        });
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} error`, async () => {
      return request(server)
        [method](PATH + '/' + '1')
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);
    });
  });
});
