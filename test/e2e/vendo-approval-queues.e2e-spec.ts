import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { useContainer } from 'class-validator';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { enable } from 'async-local-storage';

import { AppModuleTestConfig } from '../app.module.test.config';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';

import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { OemApprovalQueuePriority } from '../../src/oem/main/oem-approval-queue-priorities/oem-approval-queue-priority.entity';
import { OemVendoEntity } from '../../src/oem/main/oem-vendos/oem-vendo.entity';
import { OemUserEntity } from '../../src/oem/main/oem-users/oem-user.entity';
import { OemVendoApprovalQueue } from '../../src/oem/intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';
import { OemVendoApprovalQueueSerializeDto } from '../../src/oem/intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.dto/oem-vendo-approval-queue.serialize.dto';
import { VendoApprovalQueueStatusEnum } from '../../src/oem/intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.enums/vendo-approval-queue-status.enum';
import { VendoStatusEnum } from '../../src/oem/main/oem-vendos/oem-vendo.enums/vendo-status.enum';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemApprovalQueuePriorities from '../../src/oem/seeds/create-oem-approval-queue-priorities.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';

import { clearDB } from '../../src/utils/clear-db.util';
import { initPolicy } from '../test.utils/init-policy.util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OemHierarchiesModule } from '../../src/oem/main/oem-hierarchies/oem-hierarchies.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../../src/auth/auth.service';
import { SessionAuthGuard } from '../../src/auth/guards/session-auth.guard';
import { OemVendosUsers } from '../../src/oem/intermediaries/_oem-vendos-users/oem-vendos-users.entity';
import { VendoApprovalQueueTargetTypeEnum } from '../../src/oem/intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.enums/vendo-approval-queue-target-type.enum';
import { OemQuoteEntity } from '../../src/oem/main/oem-quotes/oem-quote.entity';
import { OemVendosQuotes } from '../../src/oem/intermediaries/_oem-vendos-quotes/oem-vendos-quotes.entity';

describe('VendoApprovalQueuesController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let company: OemCompanyEntity;
  let approvalQueuePriority: OemApprovalQueuePriority;
  let vendo: OemVendoEntity;
  let user: OemUserEntity;
  let vendoApprovalQueue: OemVendoApprovalQueue;
  let vendoApprovalCustomer: OemVendoApprovalQueue;
  let comparedData: OemVendoApprovalQueueSerializeDto;
  let logger;
  let authService;
  let access_token;
  let access_token_admin;
  let customerUser;
  let admin;
  let externalUser;
  let internalUser;
  let confirmationLink;
  const EntityClass = OemVendoApprovalQueue;
  const SerializeClass = OemVendoApprovalQueueSerializeDto;
  const PATH = '/vendo-approval-queues';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'vendoApprovalQueue';
  const PATH_VENDOS = '/vendos';
  const PATH_QUOTES = '/quotes';
  const PATH_ACTION_LOGS = '/action-logs';
  const MODEL_ACTION_LOGS = 'actionLog';

  const PATCH_DATA = {
    status: VendoApprovalQueueStatusEnum.APPROVED,
  };

  const TEST_USER = {
    companyId: 1,
    userId: 1,
    geoHierarchyId: 1,
  };

  let PUT_DATA: OemVendoApprovalQueueSerializeDto;

  const getMetaData = (method: string) => {
    let action: string;
    let expectedStatus: number;
    switch (method) {
      case 'post':
        action = 'return';
        expectedStatus = 404;
        break;
      case 'get':
        action = 'retrieve';
        expectedStatus = 200;
        break;
      case 'patch':
        action = 'update';
        expectedStatus = 200;
        break;
      case 'put':
        action = 'return';
        expectedStatus = 404;
        break;
      case 'delete':
        action = 'return';
        expectedStatus = 404;
        break;
    }
    return { action, expectedStatus };
  };

  beforeAll(async (done) => {
    enable();

    await initPolicy();
    await useSeeding();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModuleTestConfig,
        TypeOrmModule.forFeature([OemCompanyEntity]),
        OemHierarchiesModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.APP_SECRET,
          signOptions: {
            expiresIn: '1d',
            algorithm: 'HS384',
          },
          verifyOptions: {
            algorithms: ['HS384'],
          },
        }),
      ],
      controllers: [],
      providers: [Logger, AuthService],
    })
      .overrideProvider(Logger)
      .useValue({
        log: jest.fn(),
        verbose: jest.fn(),
      })
      .overrideGuard(SessionAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            ...TEST_USER,
          };
          return true;
        },
      })
      .compile();

    logger = moduleFixture.get<Logger>(Logger);
    authService = moduleFixture.get<AuthService>(AuthService);

    app = moduleFixture.createNestApplication();
    app.useLogger(logger);
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();

    company = await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    approvalQueuePriority = await runSeeder(CreateOemApprovalQueuePriorities);
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemCustomer);
    user = await runSeeder(CreateOemUsers);
    vendo = await factory(OemVendoEntity)().create({
      vendoStatus: VendoStatusEnum.PENDING_INTERNAL_APPROVAL,
    });
    admin = await factory(OemUserEntity)().create({
      userId: 10,
      companyId: 1,
      firstName: 'Vadim',
      geoHierarchyId: 1,
      roleId: 5,
      lastName: 'Vendori',
      notificationEmail: 'Demo_partner@vendori.com',
      ssoLoginEmail: 'demo@gmail.com',
      isExternal: false,
      isHideWelcomeText: false,
    });
    access_token_admin = (await authService.loginUser(admin)).access_token;

    internalUser = await factory(OemUserEntity)().create({
      userId: 6,
      companyId: 1,
      firstName: 'Vadim',
      geoHierarchyId: 1,
      roleId: 5,
      lastName: 'Vendori',
      notificationEmail: 'Demo_partner@vendori.com',
      ssoLoginEmail: 'demo@gmail.com',
      isExternal: false,
      isHideWelcomeText: false,
    });

    access_token = (await authService.loginUser(user)).access_token;

    customerUser = await factory(OemUserEntity)().create({
      userId: 7,
      companyId: 1,
      firstName: 'Vadim',
      geoHierarchyId: 1,
      roleId: 5,
      lastName: 'Vendori',
      notificationEmail: 'Demo_partner@vendori.com',
      ssoLoginEmail: 'demo1@gmail.com',
      isExternal: true,
      isHideWelcomeText: false,
    });

    externalUser = await factory(OemUserEntity)().create({
      userId: 8,
      companyId: 1,
      firstName: 'Vadim',
      geoHierarchyId: 1,
      roleId: 5,
      lastName: 'Vendori',
      notificationEmail: 'Demo_partner@vendori.com',
      ssoLoginEmail: 'demo2@gmail.com',
      isExternal: true,
      isHideWelcomeText: false,
    });

    //create internal quote user
    await factory(OemVendosUsers)().create({
      userId: user.userId,
      vendoId: 1,
      isOwner: true,
      isApprover: false,
      companyId: 1,
    });

    //create internal quote user 2
    await factory(OemVendosUsers)().create({
      userId: internalUser.userId,
      vendoId: 1,
      isOwner: true,
      isApprover: false,
      companyId: 1,
    });

    //create customer quote user
    await factory(OemVendosUsers)().create({
      userId: customerUser.userId,
      vendoId: 1,
      isOwner: false,
      isApprover: true,
      companyId: 1,
    });

    //create vendo externalUser
    await factory(OemVendosUsers)().create({
      userId: externalUser.userId,
      vendoId: 1,
      isOwner: false,
      isApprover: false,
      companyId: 1,
    });

    //create quote 1
    const quote1 = await factory(OemQuoteEntity)().create({});
    //create quote 2
    const quote2 = await factory(OemQuoteEntity)().create({});
    // quote 3
    const quote3 = await factory(OemQuoteEntity)().create({});

    //attach quote to vendo
    await factory(OemVendosQuotes)().create({
      vendoId: vendo.vendoId,
      quoteId: quote1.quoteId,
    });

    //attach quote to vendo
    await factory(OemVendosQuotes)().create({
      vendoId: vendo.vendoId,
      quoteId: quote2.quoteId,
    });

    //attach quote to vendo
    await factory(OemVendosQuotes)().create({
      vendoId: vendo.vendoId,
      quoteId: quote3.quoteId,
    });

    //attach quote to vendo
    vendoApprovalQueue = await factory(OemVendoApprovalQueue)({
      companyId: company.companyId,
      userId: user.userId,
      vendoId: vendo.vendoId,
      approvalQueuePriorityId: approvalQueuePriority.approvalQueuePriorityId,
      targetType: VendoApprovalQueueTargetTypeEnum.INTERNAL,
      token: 'test_token',
    }).create();

    await factory(OemVendoApprovalQueue)({
      companyId: company.companyId,
      userId: internalUser.userId,
      vendoId: vendo.vendoId,
      approvalQueuePriorityId: approvalQueuePriority.approvalQueuePriorityId,
      targetType: VendoApprovalQueueTargetTypeEnum.INTERNAL,
      token: 'test_token',
    }).create();

    vendoApprovalCustomer = await factory(OemVendoApprovalQueue)({
      companyId: company.companyId,
      userId: customerUser.userId,
      vendoId: vendo.vendoId,
      approvalQueuePriorityId: approvalQueuePriority.approvalQueuePriorityId,
      targetType: VendoApprovalQueueTargetTypeEnum.CUSTOMER,
      token: 'test_token',
    }).create();

    comparedData = _.omit(vendoApprovalQueue, ['createdAt', 'updatedAt']);
    comparedData.expiresAt =
      (comparedData.expiresAt &&
        moment.utc(comparedData.expiresAt).format('YYYY-MM-DDTHH:mm:ss.SSS') +
          'Z') ||
      null;

    PUT_DATA = {
      companyId: company.companyId,
      userId: user.userId,
      vendoId: vendo.vendoId,
      approvalQueuePriorityId: approvalQueuePriority.approvalQueuePriorityId,
      expiresAt: moment.utc().add(1, 'month').toDate(),
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
        .auth(access_token, { type: 'bearer' })
        .send(comparedData)
        .expect(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData.vendoApprovalQueueId)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body.data);

      expect(res.body.data).toEqual(
        expect.objectContaining(
          new SerializeClass(_.omit(comparedData, 'token')),
        ),
      );
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH_VENDOS}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} vendo`, async () => {
      const res = await request(server)
        [method](PATH_VENDOS + '/' + 1)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);

      expect(res.body.data).toEqual(
        expect.objectContaining({
          isApprovalTurn: true,
        }),
      );
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} ${MODEL}s`, async () => {
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body.data);

      expect(res.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining(
            new SerializeClass(_.omit(comparedData, 'token')),
          ),
        ]),
      );
    });
  });

  //internal approve
  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} a ${MODEL} internal`, async () => {
      const res = await request(server)
        [method](PATH + '/' + vendoApprovalQueue.vendoApprovalQueueId)
        .set('Origin', 'demo.localhost')
        .auth(access_token_admin, { type: 'bearer' })
        .send({ ...PATCH_DATA })
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body.data);

      expect(res.body.data).toEqual(expect.objectContaining({ ...PATCH_DATA }));
    });
  });

  //submit vendo internally
  describe(`${METHODS.POST.toUpperCase()} ${PATH_VENDOS}`, () => {
    const method = METHODS.POST;
    it(`should ${getMetaData(method).action} quote`, async () => {
      const res = await request(server)
        [method](PATH_VENDOS + '/' + 1 + '/submit?to=Internal')
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .send({})
        .expect(201);
      console.debug(res.body);
    });
  });

  // update a vendo into Auto-Approved
  describe(`${METHODS.PATCH.toUpperCase()} ${PATH_VENDOS}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} vendo`, async () => {
      const res = await request(server)
        [method](PATH_VENDOS + '/' + 1)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .send({
          vendoStatus: VendoStatusEnum.AUTO_APPROVED,
        })
        .expect(200);
      console.debug(res.body);
    });
  });

  //submit vendo externally
  describe(`${METHODS.POST.toUpperCase()} ${PATH_VENDOS} submit`, () => {
    const method = METHODS.POST;
    it(`should ${getMetaData(method).action} quote`, async () => {
      const res = await request(server)
        [method](
          PATH_VENDOS +
            '/' +
            1 +
            '/submit?to=External&externalUserIds=' +
            customerUser.userId +
            '&externalUserIds=' +
            externalUser.userId,
        )
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .send({})
        .expect(201);
      console.debug(res.body);
      console.debug(JSON.stringify(logger.log['mock'].calls));
      console.debug(
        logger.log['mock'].calls[
          logger.log['mock'].calls.findIndex(
            (item) =>
              item[0].userId === customerUser.userId &&
              item[0].message === 'After sending an approved email',
          )
        ][0],
      );
      expect(
        logger.log['mock'].calls[
          logger.log['mock'].calls.findIndex(
            (item) =>
              item[0].userId === customerUser.userId &&
              item[0].message === 'After sending an approved email',
          )
        ][0],
      ).toEqual(
        expect.objectContaining({
          message: 'After sending an approved email',
        }),
      );
      confirmationLink =
        logger.log['mock'].calls[
          logger.log['mock'].calls.findIndex(
            (item) =>
              item[0].userId === customerUser.userId &&
              item[0].message === 'After sending an approved email',
          )
        ][0].confirmationLink;
    });
  });

  //customer approve
  describe(`${METHODS.PATCH.toUpperCase()} ${PATH} customer`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](confirmationLink.split('https://demo.vendori.com')[1])
        .set('Origin', 'demo.localhost')
        .auth(confirmationLink.split('access_token=')[1], { type: 'bearer' })
        .send({ ...PATCH_DATA })
        .expect(getMetaData(method).expectedStatus);

      console.debug(
        res.body,
        confirmationLink.split('https://demo.vendori.com')[1],
      );

      expect(res.body.data).toEqual(expect.objectContaining({ ...PATCH_DATA }));
    });
  });

  //check if all quotes are transacted
  describe(`${METHODS.GET.toUpperCase()} ${PATH_VENDOS}`, () => {
    const method = METHODS.GET;
    it(`should ${
      getMetaData(method).action
    } a vendo and all attached quotes should be transacted`, async () => {
      const res = await request(server)
        [method](PATH_VENDOS + '/1/quotes?join=quote')
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' });
      //.expect(getMetaData(method).expectedStatus);
      console.debug(res.body.data.map((vendosQuotes) => vendosQuotes.quote));

      expect(res.body.data.map((vendosQuotes) => vendosQuotes.quote)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            quoteStatus: 'Transacted',
          }),
        ]),
      );
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH_VENDOS}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} vendo`, async () => {
      const res = await request(server)
        [method](PATH_VENDOS + '/' + 1)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body);

      expect(res.body.data).toEqual(
        expect.objectContaining({
          vendoStatus: 'Transacted',
        }),
      );
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH_ACTION_LOGS}`, () => {
    const method = METHODS.GET;
    it(`should ${
      getMetaData(method).action
    } a ${MODEL_ACTION_LOGS}`, async () => {
      const res = await request(server)
        [method](PATH_ACTION_LOGS)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body.data);

      expect(res.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'Vendo',
            association: expect.objectContaining({
              vendoId: 1,
            }),
            subject: { userId: admin.userId },
            action: 'Approve',
          }),
        ]),
      );
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} error`, async () => {
      comparedData = await factory(EntityClass)().make();

      return request(server)
        [method](PATH + '/' + comparedData.vendoApprovalQueueId)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .send({ ...comparedData, ...PUT_DATA })
        .expect(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} error`, async () => {
      return request(server)
        [method](PATH + '/' + comparedData.vendoApprovalQueueId)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .expect(getMetaData(method).expectedStatus);
    });
  });
});
