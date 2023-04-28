import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import {
  factory,
  runSeeder,
  tearDownDatabase,
  useSeeding,
} from 'typeorm-seeding';
import { useContainer } from 'class-validator';
import * as _ from 'lodash';

import { AppModuleTestConfig } from '../app.module.test.config';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';

import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { OemChannelEntity } from '../../src/oem/main/oem-channels/oem-channel.entity';
import { OemCompanyProgram } from '../../src/oem/intermediaries/_oem-company-programs/oem-company-program.entity';
import { OemCompanyProgramSerializeDto } from '../../src/oem/intermediaries/_oem-company-programs/oem-company-program.dto/oem-company-program.serialize.dto';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemChannels from '../../src/oem/seeds/create-oem-channels.seed';

import { clearDB } from '../../src/utils/clear-db.util';
import { SessionAuthGuard } from '../../src/auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../src/auth/guards/jwt-auth.guard';

import { enable } from 'async-local-storage';
import { initPolicy } from '../test.utils/init-policy.util';

enable();

describe('CompanyProgramsController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let company: OemCompanyEntity;
  let channel: OemChannelEntity;
  let companyProgram: OemCompanyProgram;
  let comparedData: OemCompanyProgramSerializeDto;
  const SerializeClass = OemCompanyProgramSerializeDto;
  const PATH = '/company-programs';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'companyProgram';

  const PATCH_DATA = {
    name: 'test',
  };
  const PUT_DATA = {
    name: 'test',
  };

  const TEST_USER = {
    companyId: 1,
    userId: 1,
    geoHierarchyId: 1,
  };

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
        action = 'return';
        expectedStatus = 404;
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

  beforeAll(async () => {
    await initPolicy();
    await useSeeding();
    company = await runSeeder(CreateOemCompanies);
    channel = await runSeeder(CreateOemChannels);
    companyProgram = await factory(OemCompanyProgram)({
      companyId: company.companyId,
      channelId: channel.channelId,
    }).create();
    comparedData = _.omit(companyProgram, ['createdAt', 'updatedAt']);

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
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send(comparedData);
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);

      expect(res.body.data).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} ${MODEL}s`, async () => {
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data[0]).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
    });
  });

  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} error`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...PATCH_DATA });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} error`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...comparedData, ...PUT_DATA });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} error`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });
});
