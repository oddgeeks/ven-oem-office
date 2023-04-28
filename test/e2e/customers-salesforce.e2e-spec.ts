import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';

import { RequestQueryBuilder } from '@nestjsx/crud-request';
import {
  factory,
  runSeeder,
  tearDownDatabase,
  useRefreshDatabase,
  useSeeding,
} from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { AppModuleTestConfig } from '../app.module.test.config';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { useContainer } from 'class-validator';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import { OemAddressEntity } from '../../src/oem/main/oem-addresses/oem-address.entity';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import { OemCustomerEntity } from '../../src/oem/main/oem-customers/oem-customer.entity';
import { OemCustomerSerializeDto } from '../../src/oem/main/oem-customers/oem-customer.dto/oem-customer.serialize.dto';
import CreateOemLicensingPrograms from '../../src/oem/seeds/create-oem-licensing-programs.seed';
import { OemLicensingProgramEntity } from '../../src/oem/main/oem-licensing-programs/oem-licensing-program.entity';
import { SessionAuthGuard } from '../../src/auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import initModuleFixture from '../test.utils/init-module-fixture.util';

import { initPolicy } from '../test.utils/init-policy.util';
import { enable } from 'async-local-storage';

enable();

describe('CustomersSalesforceController (e2e)', () => {
  jest.setTimeout(50000);
  let connection: Connection;
  let app: INestApplication;
  let server: any;
  let qb: RequestQueryBuilder;
  let company: OemCompanyEntity;
  let address: OemAddressEntity;
  let customer: OemCustomerEntity;
  let licensingProgram: OemLicensingProgramEntity;

  const MODEL = 'customer';
  const MODEL_ID = `${MODEL}Id`;

  // dynamic data
  const entityData: any = OemCustomerEntity;
  const SerializeClass: any = OemCustomerSerializeDto;
  let receivedData: OemCustomerSerializeDto;
  let comparedData: any;

  const PATH = '/customers/salesforce';
  const METHODS = {
    POST: 'post',
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
    address = await runSeeder(CreateOemAddresses);
    licensingProgram = await runSeeder(CreateOemLicensingPrograms);
    customer = await factory(OemCustomerEntity)().make();
    comparedData = {
      idOpportunity: '0065f00000995z2AAA',
      //idAccount: '0015f00000LihGx',
    };
    console.debug('comparedData', comparedData);
    const moduleFixture: TestingModule = await initModuleFixture().compile();
    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();
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

  describe(`${METHODS.POST.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.POST;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send({
          idOpportunity: '0065f000009AcIJ',
        })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(
              new SerializeClass({
                idOpportunity: '0065f000009AcIJ',
              }),
            ),
          );
          receivedData = res.body.data;
          done();
        });
    });
  });

  describe(`${METHODS.POST.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.POST;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send({
          idOpportunity: '0065f000009AcIJAA0',
        })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(
              new SerializeClass({
                idOpportunity: '0065f000009AcIJAA0',
              }),
            ),
          );
          receivedData = res.body.data;
          done();
        });
    });
  });
});
