import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager, EntityManager } from 'typeorm';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';
import * as _ from 'lodash';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';

import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import { OemVendoEntity } from '../../src/oem/main/oem-vendos/oem-vendo.entity';
import { OemVendoSerializeDto } from '../../src/oem/main/oem-vendos/oem-vendo.dto/oem-vendo.serialize.dto';
import { OemQuoteEntity } from '../../src/oem/main/oem-quotes/oem-quote.entity';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemContacts from '../../src/oem/seeds/create-oem-contacts.seed';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';
import { VendoStatusEnum } from '../../src/oem/main/oem-vendos/oem-vendo.enums/vendo-status.enum';
import { OemVendosUsers } from '../../src/oem/intermediaries/_oem-vendos-users/oem-vendos-users.entity';
import CreateOemVendosUsers from '../../src/oem/seeds/create-oem-vendos-users.seed';
import { initTestDescription } from '../test.utils/init-test.util';
import { METHODS } from '../test.enums/methods.enum';
import { initDefer } from '../../src/utils/init-defer.util';
import { ActionLogTypeEnum } from '../../src/oem/main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../src/oem/main/oem-action-logs/oem-action-log.enums/actions.enum';

describe('VendosController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  const deferServer = initDefer();
  let vendo: OemVendoEntity;

  // dynamic data
  const entityData: any = OemVendoEntity;
  const SerializeClass: any = OemVendoSerializeDto;
  let receivedData: OemVendoSerializeDto;
  let comparedData: any;

  const PATH = '/vendos';
  const MODEL = 'vendo';

  const DESCRIBE_ACTION_LOGS_GET = initTestDescription({
    httpServer: deferServer.get(),
    method: METHODS.GET,
    path: '/action-logs?join=Vendo&join=User',
  });

  const getMetaData = (method) => {
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

  beforeAll(async (done) => {
    await initPolicy();
    await useSeeding();
    await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemUsers);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemCustomer);
    await runSeeder(CreateOemContacts);
    await factory(OemQuoteEntity)().make();
    vendo = await factory(OemVendoEntity)().make();
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();
    comparedData = vendo;
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

  describe(`${METHODS.POST.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.POST;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH)
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
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
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
    beforeAll(async () => {
      const repo = getConnection('MASTER_CONNECTION_CONF').getRepository(
        OemVendoEntity,
      );
      await repo.update(receivedData.vendoId, {
        vendoStatus: VendoStatusEnum.EXPIRED,
        isLocked: true,
      });
    });

    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + receivedData.vendoId)
        .set('Origin', 'demo.localhost')
        .send({
          vendoName: 'Test',
          vendoStatus: VendoStatusEnum.DRAFT,
        })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining({
              vendoName: 'Test',
              daysSinceSubmission: '0 day(s)',
              isLocked: false,
            }),
          );
          done();
        });
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async (done) => {
      comparedData = await factory(entityData)().make();
      const res = await request(server)
        [method](PATH + '/' + receivedData.vendoId)
        .set('Origin', 'demo.localhost')
        .send(comparedData);
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
      done();
    });
  });

  describe(`${METHODS.POST.toUpperCase()} ${PATH}/:id/clone`, () => {
    let manager: EntityManager;
    let newVendo: OemVendoEntity;

    beforeAll(async () => {
      manager = getConnection('MASTER_CONNECTION_CONF').manager;
      await runSeeder(CreateOemVendosUsers);
    });

    afterAll(async () => {
      await manager.delete(OemVendosUsers, {
        vendoId: newVendo.vendoId,
      });
    });

    const method = METHODS.POST;
    it(`should clone a ${MODEL}`, async () => {
      const res = await request(server)
        [method](`${PATH}/${receivedData.vendoId}/clone`)
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toEqual(getMetaData(method).expectedStatus);

      newVendo = await manager.findOne(OemVendoEntity, res.body.data.vendoId);
      expect(res.body.data.opportunityId).toEqual(newVendo.opportunityId);
      const newVendoUser = await manager.find(OemVendosUsers, {
        vendoId: newVendo.vendoId,
      });
      const vendoUsersRepo = manager.getRepository(OemVendosUsers);
      expect(vendoUsersRepo.create(newVendo)).toEqual(
        expect.objectContaining(
          vendoUsersRepo.create(
            _.omit(newVendoUser, ['vendoId', 'createdAt', 'updatedAt']),
          ),
        ),
      );
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    let manager: EntityManager;
    const method = METHODS.DELETE;

    beforeAll(async () => {
      manager = getConnection('MASTER_CONNECTION_CONF').manager;
    });

    it(`should not ${
      getMetaData(method).action
    } a transacted ${MODEL}`, async () => {
      await manager.update(
        OemVendoEntity,
        {
          vendoId: receivedData.vendoId,
        },
        {
          vendoStatus: VendoStatusEnum.TRANSACTED,
        },
      );

      const res = await request(server)
        [method](PATH + '/' + receivedData.vendoId)
        .set('Origin', 'demo.localhost');
      // console.debug(res.body);
      expect(res.status).toEqual(403); // Forbidden resource
    });

    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      await manager.update(
        OemVendoEntity,
        {
          vendoId: receivedData.vendoId,
        },
        {
          vendoStatus: VendoStatusEnum.DRAFT,
        },
      );

      const res = await request(server)
        [method](PATH + '/' + receivedData.vendoId)
        .set('Origin', 'demo.localhost');
      // console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  DESCRIBE_ACTION_LOGS_GET({
    type: ActionLogTypeEnum.VENDO,
    action: ActionsEnum.UPDATE,
    association: expect.objectContaining({
      ...comparedData,
    }),
  });
});
