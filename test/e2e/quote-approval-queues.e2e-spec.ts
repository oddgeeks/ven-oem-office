import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';

import { AppModuleTestConfig } from '../app.module.test.config';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

import { OemCompanyEntity } from '../oem/main/oem-companies/oem-company.entity';
import { OemApprovalQueuePriority } from '../oem/main/oem-approval-queue-priorities/oem-approval-queue-priority.entity';
import { OemQuoteEntity } from '../oem/main/oem-quotes/oem-quote.entity';
import { OemUserEntity } from '../oem/main/oem-users/oem-user.entity';
import { OemQuoteApprovalQueue } from '../oem/intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { OemQuoteApprovalQueueSerializeDto } from '../oem/intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.dto/oem-quote-approval-queue.serialize.dto';
import { QuoteApprovalQueueStatusEnum } from '../oem/intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.enums/quote-approval-queue-status.enum';
import { QuoteStatusEnum } from '../oem/main/oem-quotes/oem-quote.enums/quote-status.enum';

import CreateOemCompanies from '../oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../oem/seeds/create-oem-roles.seed';
import CreateOemApprovalQueuePriorities from '../oem/seeds/create-oem-approval-queue-priorities.seed';
import CreateOemUsers from '../oem/seeds/create-oem-users.seed';
import CreateOemHierarchyLevels from '../oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../oem/seeds/create-oem-hierarchies.seed';
import CreateOemAddresses from '../oem/seeds/create-oem-addresses.seed';
import CreateOemCustomer from '../oem/seeds/create-oem-customer.seed';

import { clearDB } from '../utils/clear-db.util';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { initPolicy } from '../test.utils/init-policy.util';
import { enable } from 'async-local-storage';
import { QuoteApprovalQueueTargetTypeEnum } from '../oem/intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.enums/quote-approval-queue-target-type.enum';
import { OemQuotesUsers } from '../oem/intermediaries/_oem-quotes-users/oem-quotes-users.entity';
import { QuoteUserTypeEnum } from '../oem/intermediaries/_oem-quotes-users/oem-quotes-users.enums/quoteUserTypeEnum';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { OemHierarchiesModule } from '../oem/main/oem-hierarchies/oem-hierarchies.module';
import { OemCustomerAddresses } from '../oem/intermediaries/_oem-customer-addresses/oem-customer-addresses.entity';
import { closeAllConnection } from '../test.utils/close-all-connections.util';
import { ActionsEnum } from '../oem/main/oem-action-logs/oem-action-log.enums/actions.enum';
import { ActionLogTypeEnum } from '../oem/main/oem-action-logs/oem-action-log.enums/action-log-types.enum';

enable();

describe('QuoteApprovalQueuesController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let company: OemCompanyEntity;
  let approvalQueuePriority: OemApprovalQueuePriority;
  let quote: OemQuoteEntity;
  let user: OemUserEntity;
  let admin: OemUserEntity;
  let customerUser;
  let externalUser;
  let internalUser;
  let internalUser2;
  let quoteApprovalQueue: OemQuoteApprovalQueue;
  let quoteApprovalQueueInternal2: OemQuoteApprovalQueue;
  let quoteApprovalCustomer: OemQuoteApprovalQueue;
  let comparedData: OemQuoteApprovalQueueSerializeDto;
  let logger: Logger;
  let authService: AuthService;
  let access_token;
  let access_token_admin;
  let confirmationLink;
  let pinCode;
  const EntityClass = OemQuoteApprovalQueue;
  const SerializeClass = OemQuoteApprovalQueueSerializeDto;
  const PATH = '/quote-approval-queues';
  const PATH_EXTERNAL = '/quote-approval-queues.external';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'quoteApprovalQueue';
  const PATH_ACTION_LOGS = '/action-logs';
  const MODEL_ACTION_LOGS = 'actionLog';

  const PATH_QUOTES = '/quotes';

  const TEST_USER = {
    companyId: 1,
    userId: 1,
    geoHierarchyId: 1,
  };

  const PATCH_DATA = {
    status: QuoteApprovalQueueStatusEnum.APPROVED,
  };

  let PUT_DATA: OemQuoteApprovalQueueSerializeDto;

  const getMetaData = (method: string) => {
    let action: string;
    let expectedStatus: number;
    switch (method) {
      case 'post':
        action = 'create';
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
    admin = await factory(OemUserEntity)().create({
      userId: 10,
      companyId: 1,
      firstName: 'Admin',
      geoHierarchyId: 1,
      roleId: 1,
      lastName: 'Vendori',
      notificationEmail: 'admin@admin.com',
      ssoLoginEmail: 'admin@admin.com',
      isExternal: false,
      isHideWelcomeText: false,
    });
    const address = await runSeeder(CreateOemAddresses);

    access_token_admin = (await authService.loginUser(admin)).access_token;

    internalUser = await factory(OemUserEntity)().create({
      userId: 6,
      companyId: 1,
      firstName: 'Demo',
      geoHierarchyId: 1,
      roleId: 2,
      lastName: 'Vendori',
      notificationEmail: 'demo1.dust@gmail.com',
      ssoLoginEmail: 'demo1@gmail.com',
      isExternal: false,
      isHideWelcomeText: false,
    });

    internalUser2 = await factory(OemUserEntity)().create({
      userId: 9,
      companyId: 1,
      firstName: 'Demo',
      geoHierarchyId: 1,
      roleId: 2,
      lastName: 'Vendori',
      notificationEmail: 'demo2.dust@gmail.com',
      ssoLoginEmail: 'demo2@gmail.com',
      isExternal: false,
      isHideWelcomeText: false,
    });

    access_token = (await authService.loginUser(internalUser)).access_token;

    customerUser = await factory(OemUserEntity)().create({
      userId: 7,
      companyId: 1,
      firstName: 'Vadim',
      geoHierarchyId: 1,
      roleId: 4,
      lastName: 'Vendori',
      notificationEmail: 'diggi.dust@gmail.com',
      ssoLoginEmail: 'demo2@gmail.com',
      isExternal: true,
      isHideWelcomeText: false,
    });

    const customerAddresses = await factory(OemCustomerAddresses)().create({
      companyId: 1,
      addressId: 1,
      customerId: 1,
    });

    externalUser = await factory(OemUserEntity)().create({
      userId: 8,
      companyId: 1,
      firstName: 'Vadim',
      geoHierarchyId: 1,
      roleId: 4,
      lastName: 'Vendori',
      notificationEmail: 'Demo_partner@vendori.com',
      ssoLoginEmail: 'demo3@gmail.com',
      isExternal: true,
      isHideWelcomeText: false,
    });
    quote = await factory(OemQuoteEntity)().create({
      currency: 'usd',
      //opportunityId: null,
      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      netAmount: 9993421437874378.321876876321,
      quoteStatus: QuoteStatusEnum.PENDING_INTERNAL_APPROVAL,
    });

    console.debug(quote);

    //create internal quote user
    await factory(OemQuotesUsers)().create({
      userId: user.userId,
      quoteId: 1,
      isOwner: true,
      isApprover: false,
      type: QuoteUserTypeEnum.INTERNAL,
      companyId: 1,
    });

    //create internal quote user 2
    await factory(OemQuotesUsers)().create({
      userId: internalUser.userId,
      quoteId: 1,
      isOwner: true,
      isApprover: false,
      type: QuoteUserTypeEnum.INTERNAL,
      companyId: 1,
    });

    //create customer quote user
    await factory(OemQuotesUsers)().create({
      userId: customerUser.userId,
      quoteId: 1,
      isOwner: false,
      isApprover: true,
      type: QuoteUserTypeEnum.END_CUSTOMER,
      companyId: 1,
    });

    //create quote externalUser
    await factory(OemQuotesUsers)().create({
      userId: externalUser.userId,
      quoteId: 1,
      isOwner: false,
      isApprover: false,
      type: QuoteUserTypeEnum.PARTNER_SALES,
      companyId: 1,
    });

    //quote approval for internal user
    quoteApprovalQueue = await factory(OemQuoteApprovalQueue)({
      quoteApprovalQueueId: 1,
      companyId: company.companyId,
      userId: internalUser.userId,
      quoteId: quote.quoteId,
      approvalQueuePriorityId: 1,
      token: 'test_token',
    }).create();

    //quote approval for internal user 2
    quoteApprovalQueueInternal2 = await factory(OemQuoteApprovalQueue)({
      quoteApprovalQueueId: 2,
      companyId: company.companyId,
      userId: internalUser2.userId,
      quoteId: quote.quoteId,
      approvalQueuePriorityId: 2,
      token: 'test_token',
    }).create();

    quoteApprovalCustomer = await factory(OemQuoteApprovalQueue)({
      quoteApprovalQueueId: 2,
      companyId: company.companyId,
      userId: customerUser.userId,
      quoteId: quote.quoteId,
      targetType: QuoteApprovalQueueTargetTypeEnum.CUSTOMER,
      approvalQueuePriorityId: approvalQueuePriority.approvalQueuePriorityId,
      token: 'test_token',
    }).create();

    comparedData = _.omit(quoteApprovalQueue, ['createdAt', 'updatedAt']);
    comparedData.expiresAt =
      (comparedData.expiresAt &&
        moment.utc(comparedData.expiresAt).format('YYYY-MM-DDTHH:mm:ss.SSS') +
          'Z') ||
      null;

    PUT_DATA = {
      companyId: company.companyId,
      userId: internalUser.userId,
      quoteId: quote.quoteId,
      approvalQueuePriorityId: approvalQueuePriority.approvalQueuePriorityId,
      expiresAt: moment.utc().add(1, 'month').toDate(),
    };

    await app.init();
    server = app.getHttpServer();
    done();
  });

  afterAll(async () => {
    await clearDB();
    await closeAllConnection();
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
        [method](PATH + '/' + comparedData.quoteApprovalQueueId)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' });
      //.expect(getMetaData(method).expectedStatus);
      console.debug(res.body);

      expect(res.body.data).toEqual(
        expect.objectContaining(
          new SerializeClass(_.omit(comparedData, 'token')),
        ),
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
      console.debug(res.body);

      expect(res.body.data[0]).toEqual(
        expect.objectContaining(
          new SerializeClass(_.omit(comparedData, 'token')),
        ),
      );
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH_QUOTES}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} quote`, async () => {
      const res = await request(server)
        [method](PATH_QUOTES + '/' + 1)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body);

      expect(res.body.data).toEqual(
        expect.objectContaining({
          isApprovalTurn: true,
        }),
      );
    });
  });

  //internal approve by admin
  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData.quoteApprovalQueueId)
        .set('Origin', 'demo.localhost')
        .auth(access_token_admin, { type: 'bearer' })
        .send({ ...PATCH_DATA });
      //.expect(getMetaData(method).expectedStatus);
      console.debug(res.body);

      expect(res.body.data).toEqual(expect.objectContaining({ ...PATCH_DATA }));
    });
  });

  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + quoteApprovalQueueInternal2.quoteApprovalQueueId)
        .set('Origin', 'demo.localhost')
        .auth(access_token_admin, { type: 'bearer' })
        .send({ ...PATCH_DATA })
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body);

      expect(res.body.data).toEqual(expect.objectContaining({ ...PATCH_DATA }));
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
      console.debug(res.body);

      expect(res.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: ActionLogTypeEnum.QUOTE,
            association: expect.objectContaining({
              quoteId: 1,
            }),
            subject: { userId: admin.userId },
            action: 'Approve',
          }),
        ]),
      );
    });
  });

  //submit quote internally
  describe(`${METHODS.POST.toUpperCase()} ${PATH_QUOTES}`, () => {
    const method = METHODS.POST;
    it(`should submit internally`, async () => {
      const res = await request(server)
        [method](PATH_QUOTES + '/' + 1 + '/submit?to=Internal')
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .send({})
        .expect(201);
      console.debug(res.body);
    });
  });

  // update a quote into Auto-Approved
  describe(`${METHODS.PATCH.toUpperCase()} ${PATH_QUOTES}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} quote`, async () => {
      const res = await request(server)
        [method](PATH_QUOTES + '/' + 1)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .send({
          quoteStatus: QuoteStatusEnum.AUTO_APPROVED,
        })
        .expect(200);
      console.debug(res.body);
    });
  });

  //submit quote externally
  describe(`${METHODS.POST.toUpperCase()} ${PATH_QUOTES}`, () => {
    const method = METHODS.POST;
    it(`should submit externally quote`, async () => {
      console.debug(
        PATH_QUOTES +
          '/' +
          1 +
          '/submit?to=External&externalUserIds=' +
          customerUser.userId +
          '&externalUserIds=' +
          externalUser.userId,
      );
      const res = await request(server)
        [method](
          PATH_QUOTES +
            '/' +
            1 +
            '/submit?to=External&externalUserIds=' +
            customerUser.userId +
            '&externalUserIds=' +
            externalUser.userId,
        )
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .send({});
      console.debug(res.body);
      expect(res.status).toEqual(201);
      console.log('lastCall', logger.log['mock'].lastCall);
      console.debug(
        logger.log['mock'].lastCall[
          logger.log['mock'].lastCall.findIndex(
            (item) =>
              item.userId === customerUser.userId &&
              item.message === 'After sending an approved email',
          )
        ],
      );
      expect(
        logger.log['mock'].calls[logger.log['mock'].calls.length - 2][0],
      ).toEqual(
        expect.objectContaining({
          message: 'After sending an approved email',
        }),
      );

      confirmationLink = logger.log['mock'].lastCall[0].confirmationLink;
      pinCode =
        logger.log['mock'].calls[
          logger.log['mock'].calls.findIndex(
            (item) =>
              item[0].userId === customerUser.userId &&
              item[0].message === 'After sending an approved email',
          )
        ][0].pinCode;
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

  describe(`${METHODS.POST.toUpperCase()} ${PATH_QUOTES}`, () => {
    const method = METHODS.POST;
    it(`should verify pin code`, async () => {
      const res = await request(server)
        [method](PATH_QUOTES + '/' + 1 + '/pin-code/verify')
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .send({
          pinCode: pinCode,
        })
        .expect(201);
      console.debug(res.body, pinCode);

      expect(res.body.data).toEqual(true);
    });
  });

  //customer transact using confirmation link from email
  describe(`${METHODS.PATCH.toUpperCase()} ${PATH_EXTERNAL}`, () => {
    const method = METHODS.PATCH;
    it(`customer transact using confirmation link from email - should ${
      getMetaData(method).action
    } a ${MODEL}`, async () => {
      const res = await request(server)
        [method](confirmationLink.split('https://demo.vendori.com')[1])
        .set('Origin', 'demo.localhost')
        .auth(confirmationLink.split('access_token=')[1], { type: 'bearer' })
        .send({
          ...PATCH_DATA,
          status: QuoteApprovalQueueStatusEnum.APPROVED,
        })
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body);

      expect(res.body.data).toEqual(
        expect.objectContaining({
          ...PATCH_DATA,
          status: QuoteApprovalQueueStatusEnum.APPROVED,
        }),
      );
    });

    describe(`${METHODS.GET.toUpperCase()} ${PATH_QUOTES}`, () => {
      const method = METHODS.GET;
      it(`should ${getMetaData(method).action} quote`, async () => {
        const res = await request(server)
          [method](PATH_QUOTES + '/' + 1)
          .set('Origin', 'demo.localhost')
          .auth(access_token, { type: 'bearer' })
          .expect(getMetaData(method).expectedStatus);
        console.debug(res.body);

        expect(res.body.data).toEqual(
          expect.objectContaining({
            quoteStatus: QuoteApprovalQueueStatusEnum.TRANSACTED,
          }),
        );
      });
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} error`, async () => {
      comparedData = await factory(EntityClass)().make();

      return request(server)
        [method](PATH + '/' + comparedData.quoteApprovalQueueId)
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
        [method](PATH + '/' + comparedData.quoteApprovalQueueId)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .expect(getMetaData(method).expectedStatus);
    });
  });
});
