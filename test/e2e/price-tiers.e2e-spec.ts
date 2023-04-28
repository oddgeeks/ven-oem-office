import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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
import { OemPriceTierEntity } from '../../src/oem/main/oem-price-tiers/oem-price-tier.entity';
import { OemPricingModelEntity } from '../../src/oem/main/oem-pricing-models/oem-pricing-model.entity';
import CreateOemPricingModels from '../../src/oem/seeds/create-oem-pricing-models.seed';
import { OemUserEntity } from '../../src/oem/main/oem-users/oem-user.entity';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import { OemRoleEntity } from '../../src/oem/main/oem-roles/oem-role.entity';
import { OemHierarchyLevelEntity } from '../../src/oem/main/oem-hierarchy-levels/oem-hierarchy-level.entity';
import { OemPriceTierSerializeDto } from '../../src/oem/main/oem-price-tiers/oem-price-tier.dto/oem-price-tier.serialize.dto';
import CreateOemUnitTiers from '../../src/oem/seeds/create-oem-unit-tiers.seed';
import { OemUnitTierEntity } from '../../src/oem/main/oem-unit-tiers/oem-unit-tier.entity';
import CreateOemProducts from '../../src/oem/seeds/create-oem-products.seed';
import { OemProductEntity } from '../../src/oem/main/oem-products/oem-product.entity';
import initModuleFixture from '../test.utils/init-module-fixture.util';

import { initPolicy } from '../test.utils/init-policy.util';
import { enable } from 'async-local-storage';
enable();

describe('PriceTiersController (e2e)', () => {
  jest.setTimeout(50000);
  let connection: Connection;
  let app: INestApplication;
  let server: any;
  let qb: RequestQueryBuilder;
  let company: OemCompanyEntity;
  let user: OemUserEntity;
  let roles: OemRoleEntity;
  let hierarchyLevel: OemHierarchyLevelEntity;
  let hierarchy: OemHierarchyLevelEntity;
  let pricingModel: OemPricingModelEntity;
  let priceTier: OemPriceTierEntity;
  let unitTier: OemUnitTierEntity;
  let product: OemProductEntity;

  const MODEL = 'priceTier';
  const MODEL_ID = `${MODEL}Id`;

  // dynamic data
  const entityData: any = OemPriceTierEntity;
  const SerializeClass: any = OemPriceTierSerializeDto;
  let receivedData: OemPriceTierSerializeDto;
  let comparedData: any;

  const PATH = '/price-tiers';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };

  const PATCH_TEST = { priceUnit: 200 };

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
    roles = await runSeeder(CreateOemRoles());
    hierarchyLevel = await runSeeder(CreateOemHierarchyLevels);
    hierarchy = await runSeeder(CreateOemHierarchies);
    user = await runSeeder(CreateOemUsers);
    pricingModel = await runSeeder(CreateOemPricingModels);
    unitTier = await runSeeder(CreateOemUnitTiers);
    product = await runSeeder(CreateOemProducts);
    priceTier = await factory(OemPriceTierEntity)().make();
    comparedData = priceTier;
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
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send(comparedData)
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(new SerializeClass(comparedData)),
          );
          done();
        });
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          done();
        });
    });
  });
});
