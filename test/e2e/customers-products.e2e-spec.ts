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
import { OemUserEntity } from '../../src/oem/main/oem-users/oem-user.entity';
import { OemRoleEntity } from '../../src/oem/main/oem-roles/oem-role.entity';
import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { useContainer } from 'class-validator';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';
import { OemCustomerEntity } from '../../src/oem/main/oem-customers/oem-customer.entity';
import { clearDB } from '../../src/utils/clear-db.util';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import { OemAddressEntity } from '../../src/oem/main/oem-addresses/oem-address.entity';
import { OemHierarchyEntity } from '../../src/oem/main/oem-hierarchies/oem-hierarchy.entity';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import { OemHierarchyLevelEntity } from '../../src/oem/main/oem-hierarchy-levels/oem-hierarchy-level.entity';
import { OemQuotesContacts } from '../../src/oem/intermediaries/_oem-quotes-contacts/oem-quotes-contacts.entity';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemLicensingPrograms from '../../src/oem/seeds/create-oem-licensing-programs.seed';
import { OemLicensingProgramEntity } from '../../src/oem/main/oem-licensing-programs/oem-licensing-program.entity';

import { OemProductEntity } from '../../src/oem/main/oem-products/oem-product.entity';
import CreateOemProducts from '../../src/oem/seeds/create-oem-products.seed';
import CreateOemPricingModels from '../../src/oem/seeds/create-oem-pricing-models.seed';
import CreateOemPriceTiers from '../../src/oem/seeds/create-oem-price-tiers.seed';
import { OemPriceTierEntity } from '../../src/oem/main/oem-price-tiers/oem-price-tier.entity';
import { OemPricingModelEntity } from '../../src/oem/main/oem-pricing-models/oem-pricing-model.entity';
import CreateOemUnitTiers from '../../src/oem/seeds/create-oem-unit-tiers.seed';
import { OemUnitTierEntity } from '../../src/oem/main/oem-unit-tiers/oem-unit-tier.entity';
import initModuleFixture from '../test.utils/init-module-fixture.util';

import { initPolicy } from '../test.utils/init-policy.util';
import { enable } from 'async-local-storage';
import { OemBundleEntity } from '../../src/oem/main/oem-bundles/oem-bundle.entity';
enable();

describe('CustomersProductsController (e2e)', () => {
  jest.setTimeout(50000);
  let connection: Connection;
  let app: INestApplication;
  let server: any;
  let qb: RequestQueryBuilder;
  let roles: OemRoleEntity;
  let user: OemUserEntity;
  let company: OemCompanyEntity;
  let customer: OemCustomerEntity;
  let address: OemAddressEntity;
  let hierarchy: OemHierarchyEntity;
  let hierarchyLevel: OemHierarchyLevelEntity;
  let licensingProgram: OemLicensingProgramEntity;
  let pricingModel: OemPricingModelEntity;
  let priceTier: OemPriceTierEntity;
  let unitTier: OemUnitTierEntity;
  let products: OemProductEntity[];
  let bundle: OemBundleEntity;

  // dynamic data
  const SerializeClass: any = OemQuotesContacts;
  let receivedData: any;
  let comparedData: any;
  let baseModelData: any;
  let relationModelData: any;

  const PATH = '/customer-products';
  const METHODS = {
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const BASE_MODEL = 'customer';
  const RELATION_MODEL = 'product';

  const PUT_DATA = {
    quantity: 12,
    endDate: '2022-08-10T15:31:50.000Z',
    netPrice: 24.23,
    customerPrice: 25.25,
  };
  const PATCH_DATA = {
    quantity: 12,
    endDate: '2022-08-10T15:31:50.000Z',
    netPrice: 10.23,
    customerPrice: 12.41,
  };
  const getMetaData = (method) => {
    const expectedStatus: number = method === 'post' ? 201 : 200;
    let action: string;
    switch (method) {
      case 'get':
        action = 'retrieve';
        break;
      case 'patch':
        action = 'update';
        break;
      case 'put':
        action = 'attach';
        break;
      case 'delete':
        action = 'detach';
        break;
    }
    return { action, expectedStatus };
  };

  beforeAll(async (done) => {
    await initPolicy();
    await useSeeding();
    company = await runSeeder(CreateOemCompanies);
    roles = await runSeeder(CreateOemRoles());
    hierarchyLevel = await runSeeder(CreateOemHierarchyLevels);
    hierarchy = await runSeeder(CreateOemHierarchies);
    user = await runSeeder(CreateOemUsers);
    address = await runSeeder(CreateOemAddresses);
    licensingProgram = await runSeeder(CreateOemLicensingPrograms);
    customer = await runSeeder(CreateOemCustomer);
    pricingModel = await runSeeder(CreateOemPricingModels);
    unitTier = await runSeeder(CreateOemUnitTiers);
    products = await runSeeder(CreateOemProducts);
    priceTier = await runSeeder(CreateOemPriceTiers);
    bundle = await factory(OemBundleEntity)().create({
      products: products,
    });
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();

    baseModelData = customer;
    relationModelData = products[0];
    relationModelData.productId = 1;
    comparedData = {
      [`${BASE_MODEL}Id`]: baseModelData[`${BASE_MODEL}Id`] || 1,
      [`${RELATION_MODEL}Id`]: relationModelData[`${RELATION_MODEL}Id`] || 1,
      ...PUT_DATA,
    };
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

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} to a ${BASE_MODEL} `, (done) => {
      return request(server)
        [method](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({
          ...comparedData,
          bundleId: bundle['bundleId'],
          productId: null,
        })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(
              new SerializeClass({
                ...comparedData,
                bundleId: bundle['bundleId'],
                productId: null,
              }),
            ),
          );
          //receivedData = res.body.data;
          done();
        });
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} to a ${BASE_MODEL} `, (done) => {
      return request(server)
        [method](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
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
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} from a ${BASE_MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + receivedData.customerProductId)
        .set('Origin', 'demo.localhost')
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

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${
      getMetaData(method).action
    } ${RELATION_MODEL}s from a ${BASE_MODEL}`, (done) => {
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
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} relation in a ${BASE_MODEL}`, (done) => {
      return request(server)
        [METHODS.PUT](PATH + '/' + receivedData.customerProductId)
        .set('Origin', 'demo.localhost')
        .send({ ...comparedData, ...PATCH_DATA })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(expect.objectContaining(PATCH_DATA));
          done();
        });
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} relation in ${BASE_MODEL}`, async (done) => {
      const res = await request(server)
        [method](PATH + '/' + relationModelData[`${RELATION_MODEL}Id`])
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      done();
    });
  });
});
