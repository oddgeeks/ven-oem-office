import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import { runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { clearDB } from '../../src/utils/clear-db.util';
import { initPolicy } from '../test.utils/init-policy.util';
import initModuleFixture from '../test.utils/init-module-fixture.util';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemCustomers from '../../src/oem/seeds/create-oem-customer.seed';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import { OemCustomerEntity } from '../../src/oem/main/oem-customers/oem-customer.entity';
import { OemAddressEntity } from '../../src/oem/main/oem-addresses/oem-address.entity';
import { OemCustomerAddresses } from '../../src/oem/intermediaries/_oem-customer-addresses/oem-customer-addresses.entity';

describe('CustomerAddressesController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let customer: OemCustomerEntity;
  let address: OemAddressEntity;

  // dynamic data
  const SerializeClass = OemCustomerAddresses;
  let receivedData: any;
  let comparedData: any;
  let baseModelData: any;
  let relationModelData: any;

  const PATH = '/customers/1/addresses';
  const METHODS = {
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const BASE_MODEL = 'customer';
  const RELATION_MODEL = 'address';

  const PUT_DATA = {};
  const PATCH_DATA = {};

  const getMetaData = (method: string) => {
    const expectedStatus: number = method === 'post' ? 201 : 200;
    let action: string;
    switch (method) {
      case 'get':
        action = 'retrieve';
        break;
      case 'patch':
        action = 'update';
        break;
      case 'put':
        action = 'attach';
        break;
      case 'delete':
        action = 'detach';
        break;
    }
    return { action, expectedStatus };
  };

  beforeAll(async (done) => {
    await initPolicy();
    await useSeeding();

    await runSeeder(CreateOemCompanies);
    customer = await runSeeder(CreateOemCustomers);
    address = await runSeeder(CreateOemAddresses);
    baseModelData = customer;
    relationModelData = address;
    comparedData = {
      [`${BASE_MODEL}Id`]: baseModelData[`${BASE_MODEL}Id`],
      [`${RELATION_MODEL}Id`]: relationModelData[`${RELATION_MODEL}Id`],
      ...PUT_DATA,
    };

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
    getConnectionManager().connections.map(
      async (i) => await getConnection(i.name).close(),
    );

    await app.close();
    global.gc && global.gc();
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} to a ${BASE_MODEL} `, (done) => {
      return request(server)
        [method](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send(comparedData)
        .end((_, res) => {
          console.debug(
            res.body,
            PATH + '/' + relationModelData[`${RELATION_MODEL}Id`],
          );
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
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} from a ${BASE_MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body, relationModelData[`${RELATION_MODEL}Id`]);
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
    it(`should ${
      getMetaData(method).action
    } ${RELATION_MODEL}s from a ${BASE_MODEL}`, (done) => {
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
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} relation in a ${BASE_MODEL}`, (done) => {
      return request(server)
        [METHODS.PUT](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...comparedData, ...PATCH_DATA })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(expect.objectContaining(PATCH_DATA));
          done();
        });
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} relation in ${BASE_MODEL}`, async (done) => {
      const res = await request(server)
        [method](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      done();
    });
  });
});
