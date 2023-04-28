import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import { runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';
import { enable } from 'async-local-storage';

import { AppModuleTestConfig } from '../app.module.test.config';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import { OemCompanySerializeDto } from '../../src/oem/main/oem-companies/oem-company.dto/oem-company.serialize.dto';
import { SessionAuthGuard } from '../../src/auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../src/auth/guards/jwt-auth.guard';

import { initPolicy } from '../test.utils/init-policy.util';
import { initTestDescription } from '../test.utils/init-test.util';

import { initDefer } from '../../src/utils/init-defer.util';
import { METHODS } from '../test.enums/methods.enum';
import { getMetaData } from '../test.utils/get-metadata.util';
import { ActionLogTypeEnum } from '../../src/oem/main/oem-action-logs/oem-action-log.enums/action-log-types.enum';

describe('Companies (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  const deferServer = initDefer();
  let server: Promise<HttpServer> = deferServer.get();
  let company: OemCompanyEntity;

  // dynamic data
  const SerializeClass: any = OemCompanySerializeDto;
  let receivedData: OemCompanySerializeDto;
  let comparedData: any;

  const PATH = '/companies';

  const MODEL = 'company';
  const MODEL_ID = 'companyId';
  const PATCH_TEST = {
    dealAttributes: ['Test'],
    settings: {
      customListPriceName: 'List Price',
      customCustomerPriceName: 'Price To Customer',
      companyPrimaryColor: {
        r: 74,
        g: 137,
        b: 187,
        a: 1,
      },
    },
  };
  const TEST_USER = {
    companyId: 1,
    userId: 1,
    geoHierarchyId: 1,
  };

  const PATH_ACTION_LOGS = '/action-logs';

  const DESCRIBE_ACTION_LOGS_GET = initTestDescription({
    httpServer: deferServer.get(),
    method: METHODS.GET,
    path: PATH_ACTION_LOGS,
    SerializeClass: SerializeClass,
  });

  beforeAll(async (done) => {
    enable();
    await initPolicy();
    await useSeeding();

    company = await runSeeder(CreateOemCompanies);
    comparedData = company;
    console.debug('comparedData', comparedData);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModuleTestConfig],
      controllers: [],
      providers: [],
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
      .overrideGuard(JWTAuthGuard)
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

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();
    await app.init();
    server = app.getHttpServer();
    deferServer.resolve(server); // Resolve the promise associated to the deferred object
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
        [method](PATH + '/' + comparedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
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

  describe('Upload endpoint', () => {
    const testImage = `${__dirname}/assets/img-test.png`;
    test('Successfully uploads image', (done) => {
      return request(server)
        .post(`/upload/images`)
        .set('Origin', 'demo.localhost')
        .set('content-type', 'application/octet-stream')
        .attach('file', testImage)
        .end((_, res) => {
          console.debug(res.body);
          done();
        });

      /*const imgStream = fs.createReadStream(testImage);
      imgStream.on('end', () =>
        req.end((_, res) => {
          console.debug(res.body);
          done();
        }),
      );
      imgStream.pipe(req, { end: false });*/
    });
  });

  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send(PATCH_TEST)
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(expect.objectContaining(PATCH_TEST));
          done();
        });
    });
  });

  DESCRIBE_ACTION_LOGS_GET({
    type: ActionLogTypeEnum.COMPANY,
    association: expect.objectContaining({
      ...PATCH_TEST,
    }),
  });
});
