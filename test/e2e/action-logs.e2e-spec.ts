import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';

import { enable } from 'async-local-storage';

enable();

import { RequestQueryBuilder } from '@nestjsx/crud-request';
import {
  factory,
  runSeeder,
  tearDownDatabase,
  useRefreshDatabase,
  useSeeding,
} from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { AppModuleTestConfig } from '../app.module.test.config';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { useContainer } from 'class-validator';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import { OemAddressEntity } from '../../src/oem/main/oem-addresses/oem-address.entity';
import { OemAddressSerializeDto } from '../../src/oem/main/oem-addresses/oem-address.dto/oem-address.serialize.dto';
import { setup } from '../../src/setup';
import { SessionAuthGuard } from '../../src/auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { initPolicy } from '../test.utils/init-policy.util';

describe('ActionLogsController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let qb: RequestQueryBuilder;
  let company: OemCompanyEntity;
  let address: OemAddressEntity;

  // dynamic data
  const entityData: any = OemAddressEntity;
  const SerializeClass: any = OemAddressSerializeDto;
  let receivedData: OemAddressSerializeDto;
  let comparedData: any;

  const PATH = '/action-logs';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'actionLog';
  const MODEL_ID = 'actionLogId';
  const PATCH_TEST = { address_1: 'Test' };

  const TEST_USER = {
    companyId: 1,
    userId: 1,
    geoHierarchyId: 1,
  };
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
    company = await runSeeder(CreateOemCompanies);
    address = await factory(OemAddressEntity)().make();
    comparedData = address;
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
    setup(app);
    await app.init();
    server = app.getHttpServer();
    done();
  });

  beforeEach(() => {
    qb = RequestQueryBuilder.create();
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
  /* describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
     const method = METHODS.GET;
     it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
       return request(server)
         [method](PATH + '/' + 1)
         .set('Origin', 'demo.localhost')
         .end((_, res) => {
           console.debug(res.body);
           expect(res.status).toBe(getMetaData(method).expectedStatus);
           done();
         });
     });
   });*/
});
