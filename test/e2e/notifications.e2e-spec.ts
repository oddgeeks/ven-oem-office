import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';
import * as _ from 'lodash';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { OemNotification } from '../../src/oem/main/oem-notifications/oem-notification.entity';
import { OemNotificationSerializeDto } from '../../src/oem/main/oem-notifications/oem-notification.dto/oem-notification.serialize.dto';
import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { OemUserEntity } from '../../src/oem/main/oem-users/oem-user.entity';
import { OemCustomerEntity } from '../../src/oem/main/oem-customers/oem-customer.entity';
import { OemQuoteEntity } from '../../src/oem/main/oem-quotes/oem-quote.entity';
import { OemVendoEntity } from '../../src/oem/main/oem-vendos/oem-vendo.entity';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';
import CreateOemQuotes from '../../src/oem/seeds/create-oem-quotes.seed';
import CreateOemVendos from '../../src/oem/seeds/create-oem-vendos.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import initModuleFixture from '../test.utils/init-module-fixture.util';

import { initPolicy } from '../test.utils/init-policy.util';
import { enable } from 'async-local-storage';

describe('NotificationsController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;

  let company: OemCompanyEntity;
  let user1: OemUserEntity;
  let user2: OemUserEntity;
  let customer: OemCustomerEntity;
  let quote: OemQuoteEntity;
  let vendo: OemVendoEntity;

  let notification: OemNotification;

  let comparedData: any;
  const EntityClass = OemNotification;
  const SerializeClass = OemNotificationSerializeDto;
  const PATH = '/notifications';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'notification';
  const MODEL_ID = 'notificationId';

  let PATCH_DATA: OemNotificationSerializeDto;
  let PUT_DATA: OemNotificationSerializeDto;

  const getMetaData = (method: string) => {
    const expectedStatus: number = ['get', 'patch'].includes(method)
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
        action = 'return';
        break;
      case 'delete':
        action = 'return';
        break;
    }
    return { action, expectedStatus };
  };

  beforeAll(async () => {
    enable();
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
    user1 = await runSeeder(CreateOemUsers);
    user2 = await runSeeder(CreateOemUsers);
    await runSeeder(CreateOemAddresses);
    customer = await runSeeder(CreateOemCustomer);
    quote = await runSeeder(CreateOemQuotes);
    vendo = await runSeeder(CreateOemVendos);
    notification = await factory(OemNotification)({
      companyId: company.companyId,
      senderId: user1.userId,
      receiverId: user2.userId,
      customerId: customer.customerId,
      quoteId: quote.quoteId,
      vendoId: vendo.vendoId,
    }).create();
    comparedData = _.omit(notification, ['createdAt', 'updatedAt']);
    PATCH_DATA = {
      isRead: true,
    };
    PUT_DATA = {
      companyId: company.companyId,
      senderId: user1.userId,
      receiverId: user2.userId,
      customerId: customer.customerId,
      quoteId: quote.quoteId,
      vendoId: vendo.vendoId,
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
      return request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send(comparedData)
        .expect(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async (done) => {
      request(server)
        [method](PATH + '/' + comparedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.body.data).toEqual(
            expect.objectContaining(new SerializeClass(comparedData)),
          );
          done();
        });
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} ${MODEL}s`, (done) => {
      return request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.body.data[0]).toEqual(
            expect.objectContaining(new SerializeClass(comparedData)),
          );
          done();
        });
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

  describe(`${METHODS.POST.toUpperCase()} ${PATH}/bulk`, () => {
    const method = METHODS.POST;
    it(`should bulk update ${MODEL}s`, async () => {
      const res = await request(server)
        [method](PATH + '/bulk')
        .set('Origin', 'demo.localhost')
        .send({
          bulk: [
            {
              notificationId: notification.notificationId,
              ...PATCH_DATA,
            },
          ],
        })
        .expect(201);

      expect(res.body.data[0]).toEqual(expect.objectContaining(PATCH_DATA));
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} error`, async () => {
      comparedData = await factory(EntityClass)().make();

      return request(server)
        [method](PATH + '/' + comparedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send({ ...comparedData, ...PUT_DATA })
        .expect(getMetaData(method).expectedStatus);
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
