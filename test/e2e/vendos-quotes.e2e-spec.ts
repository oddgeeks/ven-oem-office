import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';

import { runSeeder, useSeeding } from 'typeorm-seeding';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { OemUserEntity } from '../oem/main/oem-users/oem-user.entity';
import { OemRoleEntity } from '../oem/main/oem-roles/oem-role.entity';
import { OemCompanyEntity } from '../oem/main/oem-companies/oem-company.entity';
import { useContainer } from 'class-validator';

import CreateOemCompanies from '../oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../oem/seeds/create-oem-roles.seed';
import CreateOemUsers from '../oem/seeds/create-oem-users.seed';
import { OemQuoteEntity } from '../oem/main/oem-quotes/oem-quote.entity';
import CreateOemCustomer from '../oem/seeds/create-oem-customer.seed';
import { OemCustomerEntity } from '../oem/main/oem-customers/oem-customer.entity';
import { clearDB } from '../utils/clear-db.util';
import CreateOemAddresses from '../oem/seeds/create-oem-addresses.seed';
import { OemAddressEntity } from '../oem/main/oem-addresses/oem-address.entity';
import CreateOemQuotes from '../oem/seeds/create-oem-quotes.seed';
import { OemHierarchyEntity } from '../oem/main/oem-hierarchies/oem-hierarchy.entity';
import CreateOemHierarchies from '../oem/seeds/create-oem-hierarchies.seed';
import { OemHierarchyLevelEntity } from '../oem/main/oem-hierarchy-levels/oem-hierarchy-level.entity';
import CreateOemHierarchyLevels from '../oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemVendos from '../oem/seeds/create-oem-vendos.seed';

import { OemVendoEntity } from '../oem/main/oem-vendos/oem-vendo.entity';
import { OemVendosQuotes } from '../oem/intermediaries/_oem-vendos-quotes/oem-vendos-quotes.entity';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';

describe('VendosQuotesController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let roles: OemRoleEntity;
  let user: OemUserEntity;
  let company: OemCompanyEntity;
  let customer: OemCustomerEntity;
  let address: OemAddressEntity;
  let hierarchy: OemHierarchyEntity;
  let hierarchyLevel: OemHierarchyLevelEntity;
  let quote: OemQuoteEntity;
  let vendo: OemVendoEntity;

  // dynamic data
  const SerializeClass: any = OemVendosQuotes;
  let receivedData: any;
  let comparedData: any;
  let baseModelData: any;
  let relationModelData: any;

  const PATH = '/vendos/1/quotes';
  const METHODS = {
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const BASE_MODEL = 'vendo';
  const RELATION_MODEL = 'quote';

  const PUT_DATA = {};
  const PATCH_DATA = {};

  const getMetaData = (method) => {
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
    company = await runSeeder(CreateOemCompanies);
    roles = await runSeeder(CreateOemRoles());
    hierarchyLevel = await runSeeder(CreateOemHierarchyLevels);
    hierarchy = await runSeeder(CreateOemHierarchies);
    user = await runSeeder(CreateOemUsers);
    address = await runSeeder(CreateOemAddresses);
    customer = await runSeeder(CreateOemCustomer);
    quote = await runSeeder(CreateOemQuotes);
    vendo = await runSeeder(CreateOemVendos);
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();
    baseModelData = vendo;
    relationModelData = quote;
    comparedData = {
      [`${BASE_MODEL}Id`]: baseModelData[`${BASE_MODEL}Id`],
      [`${RELATION_MODEL}Id`]: relationModelData[`${RELATION_MODEL}Id`],
      ...PUT_DATA,
    };
    console.debug('comparedData', comparedData);
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
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} from a ${BASE_MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
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
