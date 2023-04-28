import { initPolicy } from '../test.utils/init-policy.util';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModuleTestConfig } from '../app.module.test.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { OemHierarchiesModule } from '../../src/oem/main/oem-hierarchies/oem-hierarchies.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ExecutionContext, INestApplication, Logger } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { SessionAuthGuard } from '../../src/auth/guards/session-auth.guard';
import { useContainer } from 'class-validator';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemApprovalQueuePriorities from '../../src/oem/seeds/create-oem-approval-queue-priorities.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import { getConnection, getConnectionManager } from 'typeorm';
import * as request from 'supertest';
import * as _ from 'lodash';
import { enable } from 'async-local-storage';
import CreateOemQuotes from '../../src/oem/seeds/create-oem-quotes.seed';
import CreateOemVendos from '../../src/oem/seeds/create-oem-vendos.seed';
import { OemNotification } from '../../src/oem/main/oem-notifications/oem-notification.entity';
import { OemNotificationSerializeDto } from '../../src/oem/main/oem-notifications/oem-notification.dto/oem-notification.serialize.dto';
import { OemUserEntity } from '../../src/oem/main/oem-users/oem-user.entity';
enable();

describe('Performance test (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;

  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'session';

  const PATH_SESSIONS = '/sessions';
  const PATH_USERS = '/users';
  const PATH_NOTIFICATIONS = '/notifications';
  const PATH_USER_ROLES = '/user-roles';

  const TEST_USER = {
    companyId: 1,
    userId: 1,
    geoHierarchyId: 1,
  };
  const COUNT = 1;
  let logger;
  let authService;
  let access_token;
  let user;
  let server;
  let notification;
  let comparedData;
  let userClean;
  let access_token_clean;

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
  /*TestingModule =  await initModuleFixture().compile();*/
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

    const companies = [];
    const roles = [];
    const companyNames = ['demo', 'clean'];
    for (const companyName of companyNames) {
      const company = await factory(OemCompanyEntity)().create({
        companyName: companyName,
        subdomain: companyName,
        emailDomain: companyName,
      });
      roles.push(
        await runSeeder(CreateOemRoles({ companyId: company.companyId })),
      );
      companies.push(company);
    }
    await runSeeder(CreateOemApprovalQueuePriorities);
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemCustomer);
    user = await factory(OemUserEntity)().create();

    userClean = await factory(OemUserEntity)().create({
      companyId: companies[1].companyId,
      roleId: roles[1].roleId,
    });
    access_token_clean = (await authService.loginUser(userClean)).access_token;
    access_token = (await authService.loginUser(user)).access_token;
    const user1 = await factory(OemUserEntity)().create();
    const user2 = await factory(OemUserEntity)().create();
    await runSeeder(CreateOemAddresses);
    const customer = await runSeeder(CreateOemCustomer);
    const quote = await runSeeder(CreateOemQuotes);
    const vendo = await runSeeder(CreateOemVendos);
    notification = await factory(OemNotification)({
      companyId: 1,
      senderId: user1.userId,
      receiverId: user2.userId,
      customerId: customer.customerId,
      quoteId: quote.quoteId,
      vendoId: vendo.vendoId,
    }).create();
    comparedData = _.omit(notification, ['createdAt', 'updatedAt']);
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

  //performance sessions check
  describe(`performance check, count - ${COUNT} ${METHODS.GET.toUpperCase()} ${PATH_SESSIONS}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} ${MODEL}s`, (done) => {
      const results = [];
      for (let i = 0; i < COUNT; i++) {
        const res = request(server)
          [method](PATH_SESSIONS + '/me')
          .set('Origin', 'demo.localhost')
          .auth(access_token, { type: 'bearer' })
          .expect(getMetaData(method).expectedStatus);
        results.push(res);
      }
      Promise.all(results).then((values) => {
        console.debug(values.map((value) => value.body));
        done();
      });
    });
  });

  //performance user test
  describe(`performance check, count - ${COUNT} ${METHODS.GET.toUpperCase()} ${PATH_USERS}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a user`, (done) => {
      const results = [];
      for (let i = 0; i < COUNT; i++) {
        const res = request(server)
          [method](PATH_USERS + '/' + 1 + '?join=role&join=company')
          .set('Origin', 'demo.localhost')
          .auth(access_token, { type: 'bearer' })
          .expect(getMetaData(method).expectedStatus);
        results.push(res);
      }
      Promise.all(results).then((values) => {
        console.debug(values.map((value) => value.body));
        done();
      });
    });
  });
  //performance notification test
  describe(`performance check, count - ${COUNT} ${METHODS.GET.toUpperCase()} ${PATH_NOTIFICATIONS}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a notification`, (done) => {
      const results = [];
      for (let i = 0; i < COUNT; i++) {
        const res1 = request(server)
          [method](PATH_NOTIFICATIONS + '/' + notification.notificationId)
          .set('Origin', 'demo.localhost')
          .auth(access_token, { type: 'bearer' })
          /*.then((_, res) => {
            console.debug(res.body);
            expect(res.body.data).toEqual(
              expect.objectContaining(
                new OemNotificationSerializeDto(comparedData),
              ),
            );
          })*/
          .expect(getMetaData(method).expectedStatus);
        results.push(res1);

        const res = request(server)
          [method](PATH_NOTIFICATIONS)
          .set('Origin', 'demo.localhost')
          .auth(access_token, { type: 'bearer' })
          /*.end((_, res) => {
            console.debug(res.body);

            expect(res.body.data[0]).toEqual(
              expect.objectContaining(
                new OemNotificationSerializeDto(comparedData),
              ),
            );
          });*/
          .expect(getMetaData(method).expectedStatus);
        results.push(res);
      }
      Promise.all(results).then((values) => {
        console.debug(values.map((value) => value.body));
        done();
      });
    });
  });
  //performance user roles test
  describe(`performance check, count - ${COUNT} ${METHODS.GET.toUpperCase()} ${PATH_USER_ROLES}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      const results = [];
      for (let i = 0; i < COUNT; i++) {
        const res = request(server)
          [method](PATH_USER_ROLES + '/')
          .set('Origin', 'demo.localhost')
          .auth(access_token, { type: 'bearer' })
          /*.end((_, res) => {
            console.debug(res.body);
          })*/
          .expect(getMetaData(method).expectedStatus);
        results.push(res);

        const res1 = request(server)
          [method](PATH_USER_ROLES)
          .set('Origin', 'clean.localhost')
          .auth(access_token_clean, { type: 'bearer' })
          .expect(getMetaData(method).expectedStatus);
        //console.debug(res.body);
        results.push(res1);
      }
      Promise.all(results).then((values) => {
        console.debug(values.map((value) => value.body));
        done();
      });
    });
  });
});
