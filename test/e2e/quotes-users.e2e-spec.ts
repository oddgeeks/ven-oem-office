import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';

import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { OemUserEntity } from '../../src/oem/main/oem-users/oem-user.entity';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import { OemQuoteEntity } from '../../src/oem/main/oem-quotes/oem-quote.entity';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import CreateOemQuotes from '../../src/oem/seeds/create-oem-quotes.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import { OemQuotesUsers } from '../../src/oem/intermediaries/_oem-quotes-users/oem-quotes-users.entity';
import { QuoteUserTypeEnum } from '../../src/oem/intermediaries/_oem-quotes-users/oem-quotes-users.enums/quoteUserTypeEnum';
import CreateOemApprovalQueuePriorities from '../../src/oem/seeds/create-oem-approval-queue-priorities.seed';
import { initPolicy } from '../test.utils/init-policy.util';
import { enable } from 'async-local-storage';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { OemQuoteApprovalQueue } from '../../src/oem/intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { QuoteApprovalQueueTargetTypeEnum } from '../../src/oem/intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.enums/quote-approval-queue-target-type.enum';

describe('QuotesUsersController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let quote: OemQuoteEntity;
  let quoteUserExternal: OemUserEntity;
  let quoteUserInternal: OemUserEntity;
  let user: OemUserEntity;
  let quoteApprovalQueue: OemQuoteApprovalQueue;
  let quoteApprovalCustomer: OemQuoteApprovalQueue;
  let approvalQueuePriority: OemQuoteApprovalQueue;

  // dynamic data
  const SerializeClass: any = OemQuotesUsers;
  let comparedData: any;
  let baseModelData: any;
  let relationModelData: any;

  const PATH = '/quotes/1/users';
  const METHODS = {
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const BASE_MODEL = 'quote';
  const RELATION_MODEL = 'user';

  const PUT_DATA = {
    type: QuoteUserTypeEnum.END_CUSTOMER,
    isOwner: false,
    isApprover: true,
    companyId: 1,
  };
  const PATCH_DATA = {
    type: QuoteUserTypeEnum.DISTRIBUTOR_SALES,
    isOwner: true,
    isApprover: false,
    companyId: 1,
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
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemCustomer);
    user = await runSeeder(CreateOemUsers);
    quote = await runSeeder(CreateOemQuotes);
    approvalQueuePriority = await runSeeder(CreateOemApprovalQueuePriorities);
    //await runSeeder(CreateOemQuoteApprovalQueues);
    quoteUserInternal = await factory(OemUserEntity)().create({
      userId: 5,
      companyId: 1,
      firstName: 'Test',
      geoHierarchyId: 1,
      roleId: 5,
      lastName: 'Vendori',
      notificationEmail: 'Demo_partner@vendori.com',
      ssoLoginEmail: 'demo@gmail.com',
      isExternal: false,
      isHideWelcomeText: false,
    });
    quoteUserExternal = await factory(OemUserEntity)().create({
      userId: 6,
      companyId: 1,
      firstName: 'Test',
      geoHierarchyId: 1,
      roleId: 5,
      lastName: 'Vendori',
      notificationEmail: 'Demo_partner@vendori.com',
      ssoLoginEmail: 'demo@gmail.com',
      isExternal: true,
      isHideWelcomeText: false,
    });
    baseModelData = quote;
    relationModelData = quoteUserInternal;
    comparedData = {
      [`${BASE_MODEL}Id`]: baseModelData[`${BASE_MODEL}Id`],
      [`${RELATION_MODEL}Id`]: relationModelData[`${RELATION_MODEL}Id`],
      ...PUT_DATA,
    };

    quoteApprovalQueue = await factory(OemQuoteApprovalQueue)({
      quoteApprovalQueueId: 1,
      companyId: 1,
      userId: user.userId,
      quoteId: quote.quoteId,
      approvalQueuePriorityId: approvalQueuePriority.approvalQueuePriorityId,
      token: 'test_token',
    }).create();

    quoteApprovalCustomer = await factory(OemQuoteApprovalQueue)({
      quoteApprovalQueueId: 2,
      companyId: 1,
      userId: quoteUserExternal.userId,
      quoteId: quote.quoteId,
      targetType: QuoteApprovalQueueTargetTypeEnum.CUSTOMER,
      approvalQueuePriorityId: approvalQueuePriority.approvalQueuePriorityId,
      token: 'test_token',
    }).create();

    console.debug(comparedData);
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

  //put internal quote user
  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} to a ${BASE_MODEL} `, (done) => {
      return request(server)
        [method](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({
          ...comparedData,
          userId: quoteUserInternal.userId,
          isApprover: false,
        })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(
              new SerializeClass({
                ...comparedData,
                userId: quoteUserInternal.userId,
                isApprover: false,
              }),
            ),
          );
          done();
        });
    });
  });

  //should be in quoteApprovalQueue

  //put external quote user
  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} to a ${BASE_MODEL} `, (done) => {
      return request(server)
        [method](PATH + '/' + quoteUserExternal.userId)
        .set('Origin', 'demo.localhost')
        .send({ userId: quoteUserExternal.userId, quoteId: 1, ...PUT_DATA })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(
              new SerializeClass({
                userId: quoteUserExternal.userId,
                quoteId: 1,
                ...PUT_DATA,
              }),
            ),
          );
          done();
        });
    });
  });

  //check internal quote user
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
            '?join[]=company&join[]=user&join[]=user.company',
        )
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(
              new SerializeClass({ ...comparedData, isApprover: false }),
            ),
          );
          done();
        });
    });
  });

  //check external quote users
  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} from a ${BASE_MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + quoteUserExternal.userId)
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(
              new SerializeClass({
                ...comparedData,
                userId: quoteUserExternal.userId,
                isApprover: true,
              }),
            ),
          );
          done();
        });
    });
  });

  //get users from quote
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
            expect.objectContaining(
              new SerializeClass({ ...comparedData, isApprover: false }),
            ),
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
        [METHODS.PATCH](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...comparedData, ...PATCH_DATA })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(new SerializeClass(PATCH_DATA)),
          );
          done();
        });
    });
  });

  //cannot set isApprover to false
  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} relation in a ${BASE_MODEL} error`, (done) => {
      return request(server)
        [METHODS.PATCH](PATH + '/' + quoteUserExternal.userId)
        .set('Origin', 'demo.localhost')
        .send({
          ...PATCH_DATA,
          userId: quoteUserExternal.userId,
          isApprover: false,
        })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(400);
          done();
        });
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} relation in ${BASE_MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          done();
        });
    });
  });
});
