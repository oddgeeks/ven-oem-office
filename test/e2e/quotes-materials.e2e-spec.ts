import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';

import { runSeeder, useSeeding } from 'typeorm-seeding';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { OemUserEntity } from '../../src/oem/main/oem-users/oem-user.entity';
import { OemRoleEntity } from '../../src/oem/main/oem-roles/oem-role.entity';
import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { useContainer } from 'class-validator';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import { OemQuoteEntity } from '../../src/oem/main/oem-quotes/oem-quote.entity';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';
import { OemCustomerEntity } from '../../src/oem/main/oem-customers/oem-customer.entity';
import { clearDB } from '../../src/utils/clear-db.util';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import { OemAddressEntity } from '../../src/oem/main/oem-addresses/oem-address.entity';
import CreateOemQuotes from '../../src/oem/seeds/create-oem-quotes.seed';
import { OemHierarchyEntity } from '../../src/oem/main/oem-hierarchies/oem-hierarchy.entity';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import { OemHierarchyLevelEntity } from '../../src/oem/main/oem-hierarchy-levels/oem-hierarchy-level.entity';
import { OemQuotesContacts } from '../../src/oem/intermediaries/_oem-quotes-contacts/oem-quotes-contacts.entity';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import { OemMaterialEntity } from '../../src/oem/main/oem-materials/oem-material.entity';
import CreateOemMaterials from '../../src/oem/seeds/create-oem-materials.seed';

import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';
import { initTestDescription } from '../test.utils/init-test.util';
import { METHODS } from '../test.enums/methods.enum';
import { initDefer } from '../../src/utils/init-defer.util';
import { ActionLogTypeEnum } from '../../src/oem/main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../src/oem/main/oem-action-logs/oem-action-log.enums/actions.enum';

describe('QuotesMaterialsController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  const deferServer = initDefer();
  let roles: OemRoleEntity;
  let user: OemUserEntity;
  let quote: OemQuoteEntity;
  let company: OemCompanyEntity;
  let customer: OemCustomerEntity;
  let address: OemAddressEntity;
  let material: OemMaterialEntity;
  let hierarchy: OemHierarchyEntity;
  let hierarchyLevel: OemHierarchyLevelEntity;

  // dynamic data
  const SerializeClass: any = OemQuotesContacts;
  let receivedData: any;
  let comparedData: any;
  let baseModelData: any;
  let relationModelData: any;

  const PATH = '/quotes/1/materials';
  const BASE_MODEL = 'quote';
  const RELATION_MODEL = 'material';

  const PUT_DATA = {
    position: 1,
  };
  const PATCH_DATA = {
    position: 2,
  };

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
  const DESCRIBE_ACTION_LOGS_GET = initTestDescription({
    httpServer: deferServer.get(),
    method: METHODS.GET,
    path: '/action-logs?join=Material&join=Quote&join=User',
  });

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
    roles = await runSeeder(CreateOemRoles());
    hierarchyLevel = await runSeeder(CreateOemHierarchyLevels);
    hierarchy = await runSeeder(CreateOemHierarchies);
    user = await runSeeder(CreateOemUsers);
    address = await runSeeder(CreateOemAddresses);
    customer = await runSeeder(CreateOemCustomer);
    material = (await runSeeder(CreateOemMaterials))[0];
    quote = await runSeeder(CreateOemQuotes);
    baseModelData = quote;
    relationModelData = material;
    comparedData = {
      [`${BASE_MODEL}Id`]: baseModelData[`${BASE_MODEL}Id`],
      [`${RELATION_MODEL}Id`]: relationModelData[`${RELATION_MODEL}Id`],
      ...PUT_DATA,
    };

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

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should not ${
      getMetaData(method).action
    } a ${RELATION_MODEL} with position 0 to a ${BASE_MODEL} `, (done) => {
      return request(server)
        [method](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...comparedData, position: 0 })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(400);
          receivedData = res.body.data;
          done();
        });
    });
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

  DESCRIBE_ACTION_LOGS_GET({
    type: ActionLogTypeEnum.QUOTE,
    action: ActionsEnum.ATTACH,
    association: expect.objectContaining({
      ...comparedData,
    }),
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
