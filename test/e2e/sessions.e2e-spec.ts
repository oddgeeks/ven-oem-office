import { initPolicy } from '../test.utils/init-policy.util';
import { runSeeder, useSeeding } from 'typeorm-seeding';
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
import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemApprovalQueuePriorities from '../../src/oem/seeds/create-oem-approval-queue-priorities.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import { getConnection, getConnectionManager } from 'typeorm';
import * as request from 'supertest';
import * as _ from 'lodash';

describe('QuoteApprovalQueuesController (e2e)', () => {
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

  const PATH = '/sessions';

  const TEST_USER = {
    companyId: 1,
    userId: 1,
    geoHierarchyId: 1,
  };
  let logger;
  let authService;
  let access_token;
  let user;
  let server;

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

    await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemApprovalQueuePriorities);
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemCustomer);
    user = await runSeeder(CreateOemUsers);
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

  //performance check
  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} ${MODEL}s`, async () => {
      const results = [];
      for (let i = 0; i < 10; i++) {
        const res = request(server)
          [method](PATH + '/me')
          .set('Origin', 'demo.localhost')
          .auth(access_token, { type: 'bearer' })
          .expect(getMetaData(method).expectedStatus);
        results.push(res);
      }
      Promise.all(results).then((values) => {
        console.debug(values.map((value) => value.body));
      });
    });
  });
});
