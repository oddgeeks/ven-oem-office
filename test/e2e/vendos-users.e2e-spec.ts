import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import { enable } from 'async-local-storage';

import { runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { OemUserEntity } from '../../src/oem/main/oem-users/oem-user.entity';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import { OemVendoEntity } from '../../src/oem/main/oem-vendos/oem-vendo.entity';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import CreateOemVendos from '../../src/oem/seeds/create-oem-vendos.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemLicensingPrograms from '../../src/oem/seeds/create-oem-licensing-programs.seed';
import { OemVendosUsers } from '../../src/oem/intermediaries/_oem-vendos-users/oem-vendos-users.entity';
import CreateOemApprovalQueuePriorities from '../../src/oem/seeds/create-oem-approval-queue-priorities.seed';
import CreateOemVendoApprovalQueues from '../../src/oem/seeds/create-oem-vendo-approval-queues.seed';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';

describe('VendosUsersController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let vendo: OemVendoEntity;
  let vendoUser: OemUserEntity;

  // dynamic data
  const SerializeClass: any = OemVendosUsers;
  let comparedData: any;
  let baseModelData: any;
  let relationModelData: any;

  const PATH = '/vendos/1/users';
  const METHODS = {
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const BASE_MODEL = 'vendo';
  const RELATION_MODEL = 'user';

  const PUT_DATA = {
    isOwner: true,
    isApprover: false,
    companyId: 1,
  };
  const PATCH_DATA = {
    isOwner: false,
    isApprover: false,
  };

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

  beforeAll(async () => {
    enable();
    await initPolicy();
    await useSeeding();
    await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    vendoUser = await runSeeder(CreateOemUsers);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemCustomer);
    vendo = await runSeeder(CreateOemVendos);
    await runSeeder(CreateOemApprovalQueuePriorities);
    await runSeeder(CreateOemVendoApprovalQueues);
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();
    baseModelData = vendo;
    relationModelData = vendoUser;
    comparedData = {
      [`${BASE_MODEL}Id`]: baseModelData[`${BASE_MODEL}Id`],
      [`${RELATION_MODEL}Id`]: relationModelData[`${RELATION_MODEL}Id`],
      ...PUT_DATA,
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

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} to a ${BASE_MODEL} `, async () => {
      const res = await request(server)
        [method](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send(comparedData)
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body);

      expect(res.body.data).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} from a ${BASE_MODEL}`, (done) => {
      return request(server)
        [method](
          PATH +
            '/' +
            relationModelData[`${RELATION_MODEL}Id`] +
            '?join[]=company&join[]=user&join[]=user.company&join[]=user.role',
        )
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(new SerializeClass({ ...comparedData })),
          );
          expect(res.body.data).toHaveProperty('user');
          expect(res.body.data.user).toHaveProperty('company');
          expect(res.body.data.user).toHaveProperty('role');
          done();
        });
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${
      getMetaData(method).action
    } ${RELATION_MODEL}s from a ${BASE_MODEL}`, async () => {
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
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} relation in a ${BASE_MODEL}`, (done) => {
      return request(server)
        [METHODS.PATCH](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
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
    } a ${RELATION_MODEL} relation in ${BASE_MODEL}`, async () => {
      return request(server)
        [method](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);
    });
  });
});
