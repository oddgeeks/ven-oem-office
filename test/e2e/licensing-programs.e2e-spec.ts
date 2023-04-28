import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';

import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { useContainer } from 'class-validator';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import { OemLicensingProgramEntity } from '../../src/oem/main/oem-licensing-programs/oem-licensing-program.entity';
import { OemLicensingProgramSerializeDto } from '../../src/oem/main/oem-licensing-programs/oem-licensing-program.dto/oem-licensing-program.serialize.dto';
import initModuleFixture from '../test.utils/init-module-fixture.util';

import { initPolicy } from '../test.utils/init-policy.util';
import { enable } from 'async-local-storage';
enable();

describe('LicensingProgramController (e2e)', () => {
  jest.setTimeout(50000);
  let connection: Connection;
  let app: INestApplication;
  let server: any;
  let qb: RequestQueryBuilder;
  let company: OemCompanyEntity;
  let licensingProgram: OemLicensingProgramEntity;

  const MODEL = 'licensingProgram';
  const MODEL_ID = `${MODEL}Id`;

  // dynamic data
  const EntityClass = OemLicensingProgramEntity;
  const SerializeClass = OemLicensingProgramSerializeDto;
  let receivedData: OemLicensingProgramSerializeDto;
  let comparedData: OemLicensingProgramEntity;

  const PATH = '/licensing-programs';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };

  const PATCH_TEST = { licensingProgramName: 'Test' };
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
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();

    company = await runSeeder(CreateOemCompanies);
    licensingProgram = await factory(OemLicensingProgramEntity)().make();
    comparedData = licensingProgram;
    console.debug('comparedData', comparedData);
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

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async (done) => {
      comparedData = await factory(EntityClass)().make();
      const res = await request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send(comparedData);
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
      done();
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async (done) => {
      const res = await request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      done();
    });
  });
});
