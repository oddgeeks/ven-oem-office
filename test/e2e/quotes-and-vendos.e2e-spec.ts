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
import CreateOemLicensingPrograms from '../oem/seeds/create-oem-licensing-programs.seed';

import { clearDB } from '../utils/clear-db.util';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';

import { initPolicy } from '../test.utils/init-policy.util';
import { enable } from 'async-local-storage';
import { QuoteApprovalQueueTargetTypeEnum } from '../oem/intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.enums/quote-approval-queue-target-type.enum';
import { OemQuotesUsers } from '../oem/intermediaries/_oem-quotes-users/oem-quotes-users.entity';
import { QuoteUserTypeEnum } from '../oem/intermediaries/_oem-quotes-users/oem-quotes-users.enums/quoteUserTypeEnum';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OemHierarchiesModule } from '../oem/main/oem-hierarchies/oem-hierarchies.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import CreateOemCompanyChannels from '../oem/seeds/create-oem-company-channels.seed';
import CreateOemChannels from '../oem/seeds/create-oem-channels.seed';
import CreateOemCompanyPrograms from '../oem/seeds/create-oem-company-programs.seed';

describe('QuoteAndVendos (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let company: OemCompanyEntity;
  let approvalQueuePriority: OemApprovalQueuePriority;
  let quote: OemQuoteEntity;
  let user: OemUserEntity;
  let customerUser;
  let externalUser;
  let internalUser;
  let quoteApprovalQueue: OemQuoteApprovalQueue;
  let quoteApprovalCustomer: OemQuoteApprovalQueue;
  let comparedData: OemQuoteApprovalQueueSerializeDto;
  let logger: Logger;
  let authService: AuthService;
  let access_token;
  let confirmationLink;
  const EntityClass = OemQuoteApprovalQueue;
  const SerializeClass = OemQuoteApprovalQueueSerializeDto;
  const PATH = '/quotes-and-vendos';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'quote';

  const PATH_QUOTES = '/quotes';
  const PATH_QUEUES = '/quote-approval-queues';

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

    company = await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    approvalQueuePriority = await runSeeder(CreateOemApprovalQueuePriorities);
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemCustomer);
    await runSeeder(CreateOemChannels);
    await runSeeder(CreateOemCompanyPrograms);
    await runSeeder(CreateOemLicensingPrograms);
    await runSeeder(CreateOemCompanyChannels);
    user = await runSeeder(CreateOemUsers);

    internalUser = await factory(OemUserEntity)().create({
      userId: 6,
      companyId: 1,
      firstName: 'Test 1',
      geoHierarchyId: 1,
      roleId: 2,
      lastName: 'Vendori',
      notificationEmail: 'demo1@gmail.com',
      ssoLoginEmail: 'demo1@gmail.com',
      isExternal: false,
      isHideWelcomeText: false,
    });

    customerUser = await factory(OemUserEntity)().create({
      userId: 7,
      companyId: 1,
      firstName: 'Test 2',
      geoHierarchyId: 1,
      roleId: 4,
      lastName: 'Vendori',
      notificationEmail: 'demo1@gmail.com',
      ssoLoginEmail: 'demo2@gmail.com',
      isExternal: false,
      isHideWelcomeText: false,
    });

    externalUser = await factory(OemUserEntity)().create({
      userId: 8,
      companyId: 1,
      firstName: 'Test 3',
      geoHierarchyId: 1,
      roleId: 4,
      lastName: 'Vendori',
      notificationEmail: 'Demo_partner@vendori.com',
      ssoLoginEmail: 'demo3@gmail.com',
      isExternal: true,
      isHideWelcomeText: false,
    });

    quote = await factory(OemQuoteEntity)().create({
      quoteName: 'VEN-951',
      currency: 'usd',
      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      netAmount: 9993421437874378.321876876321,
      quoteStatus: QuoteStatusEnum.PENDING_INTERNAL_APPROVAL,
    });

    const quote_2 = await factory(OemQuoteEntity)().create({
      currency: 'usd',
      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      netAmount: 9993421437874378.321876876321,
      quoteStatus: QuoteStatusEnum.PENDING_INTERNAL_APPROVAL,
    });

    const quote_3 = await factory(OemQuoteEntity)().create({
      quoteUuid: 'Q-1234567891',
      currency: 'usd',
      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      netAmount: 9993421437874378.321876876321,
      quoteStatus: QuoteStatusEnum.PENDING_INTERNAL_APPROVAL,
    });

    //create internal quote user
    await factory(OemQuotesUsers)().create({
      userId: user.userId,
      quoteId: 1,
      isOwner: true,
      isApprover: false,
      type: QuoteUserTypeEnum.INTERNAL,
      companyId: 1,
    });

    //create internal quote user
    await factory(OemQuotesUsers)().create({
      userId: user.userId,
      quoteId: quote_2.quoteId,
      isOwner: true,
      isApprover: false,
      type: QuoteUserTypeEnum.INTERNAL,
      companyId: 1,
    });

    //create internal quote user 2
    await factory(OemQuotesUsers)().create({
      userId: internalUser.userId,
      quoteId: 1,
      isOwner: false,
      isApprover: false,
      type: QuoteUserTypeEnum.INTERNAL,
      companyId: 1,
    });

    //create internal quote user 2
    await factory(OemQuotesUsers)().create({
      userId: internalUser.userId,
      quoteId: quote_2.quoteId,
      isOwner: false,
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
      //quoteApprovalQueueId: 1,
      companyId: company.companyId,
      userId: user.userId,
      quoteId: quote.quoteId,
      approvalQueuePriorityId: 2,
      token: 'test_token',
    }).create();

    //quote approval for internal user
    await factory(OemQuoteApprovalQueue)({
      //quoteApprovalQueueId: 1,
      companyId: company.companyId,
      userId: user.userId,
      quoteId: quote_2.quoteId,
      approvalQueuePriorityId: 1,
      token: 'test_token',
    }).create();

    //quote approval for internal user 2
    await factory(OemQuoteApprovalQueue)({
      //quoteApprovalQueueId: 1,
      companyId: company.companyId,
      userId: internalUser.userId,
      quoteId: quote.quoteId,
      approvalQueuePriorityId: 1,
      token: 'test_token',
    }).create();

    //quote approval for internal user 2
    await factory(OemQuoteApprovalQueue)({
      //quoteApprovalQueueId: 1,
      companyId: company.companyId,
      userId: internalUser.userId,
      quoteId: quote_2.quoteId,
      approvalQueuePriorityId: 2,
      token: 'test_token',
    }).create();

    quoteApprovalCustomer = await factory(OemQuoteApprovalQueue)({
      //quoteApprovalQueueId: 2,
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
      userId: user.userId,
      quoteId: quote.quoteId,
      approvalQueuePriorityId: approvalQueuePriority.approvalQueuePriorityId,
      expiresAt: moment.utc().add(1, 'month').toDate(),
    };

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
    access_token = (await authService.loginUser(user)).access_token;

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

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + 'all')
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe.only(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](
          PATH +
            '/' +
            'all?sort=quoteId%2CDESC&sort=vendoId%2CDESC&or=quoteUuid%7C%7C%24contL%7C%7CQ-',
        )
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            quoteUuid: 'Q-1234567891',
          }),
        ]),
      );
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](
          PATH +
            '/' +
            'all?sort=quoteId%2CDESC&sort=vendoId%2CDESC&or=quoteName%7C%7C%24contL%7C%7Cven-951&or=vendoName%7C%7C%24contL%7C%7Cven-951&or=quoteUuid%7C%7C%24contL%7C%7Cven-951&or=vendoUuid%7C%7C%24contL%7C%7Cven-951',
        )
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            quoteName: 'VEN-951',
          }),
        ]),
      );
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH_QUEUES}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const access_token = (await authService.loginUser(internalUser))
        .access_token;
      const res = await request(server)
        [method](PATH_QUEUES)
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH_QUOTES}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const access_token = (await authService.loginUser(internalUser))
        .access_token;
      const res = await request(server)
        [method](PATH_QUOTES + '/1')
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH_QUOTES}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const access_token = (await authService.loginUser(internalUser))
        .access_token;
      const res = await request(server)
        [method](PATH_QUOTES + '/2')
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const access_token = (await authService.loginUser(internalUser))
        .access_token;
      const res = await request(server)
        [method](PATH + '/' + 'workflow-pending-approval')
        .set('Origin', 'demo.localhost')
        .auth(access_token, { type: 'bearer' })
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body);
    });
  });
});
