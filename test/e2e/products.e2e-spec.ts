import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import { useContainer } from 'class-validator';
import { enable } from 'async-local-storage';

import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import { OemProductEntity } from '../../src/oem/main/oem-products/oem-product.entity';
import { OemProductSerializeDto } from '../../src/oem/main/oem-products/oem-product.dto/oem-product.serialize.dto';
import CreateOemPricingModels from '../../src/oem/seeds/create-oem-pricing-models.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemUnitTiers from '../../src/oem/seeds/create-oem-unit-tiers.seed';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';
import { RunMultipleSeeds } from '../../src/oem/seeds/seed.utils/run-multiple-seeds.util';
import { closeAllConnection } from '../test.utils/close-all-connections.util';
import CreateOemPriceTiers from '../../src/oem/seeds/create-oem-price-tiers.seed';
import { OemProductsRelationships } from '../../src/oem/intermediaries/_oem-products-relationships/oem-products-relationships.entity';
import CreateOemProductsRelationships from '../../src/oem/seeds/create-oem-products-relationships.seed';

enable();

describe('ProductController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let product: OemProductEntity;

  const MODEL = 'product';
  const MODEL_ID = `${MODEL}Id`;

  // dynamic data
  const entityData: any = OemProductEntity;
  const SerializeClass: any = OemProductSerializeDto;
  let receivedData: OemProductSerializeDto;
  let comparedData: any;

  const PATH = '/products';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };

  const PATCH_TEST = { productName: 'Test', productHierarchyId: 97 };
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

    await RunMultipleSeeds([
      CreateOemCompanies,
      CreateOemRoles(),
      CreateOemHierarchyLevels,
      CreateOemHierarchies,
      CreateOemUsers,
      CreateOemPricingModels,
      CreateOemUnitTiers,
    ]);
    product = await factory(OemProductEntity)().make();
    product.productId = 1;
    product.productHierarchyId = 96;
    comparedData = product;
    console.debug('comparedData', comparedData);
    await app.init();
    server = app.getHttpServer();
    done();
  });

  afterAll(async () => {
    await clearDB();
    await closeAllConnection();
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
          runSeeder(CreateOemPriceTiers).then(() => done());
        });
    });
  });

  describe(`${METHODS.POST.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.POST;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send({ ...comparedData, productId: 2, productName: 'Test 2' })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(
              new SerializeClass({
                ...comparedData,
                productId: 2,
                productName: 'Test 2',
              }),
            ),
          );
          runSeeder(CreateOemProductsRelationships).then(() => done());
        });
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](
          PATH +
            '?join=pricingModel&join=priceTiers&join=priceTiers.unitTier&s={"$and":[{"productName":{"$contL":""}},{"productAvailability":{"$in":["{Current, Retired}", "{Current}", "{Retired}"]}},null]}',
        )
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

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](
          PATH +
            '/1' +
            '?join=pricingModel||modelName,unitDuration,unitMetric&join=priceTiers&join=priceTiers.unitTier&sort=priceTiers.unitTier.startRange,ASC&filter=priceTiers.isEnabled||eq||true',
        )
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

  //update product hierarchy
  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](PATH + '/' + receivedData[MODEL_ID])
        .set('Origin', 'demo.localhost')
        .send({ ...PATCH_TEST, productHierarchyId: 95 })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining({ ...PATCH_TEST, productHierarchyId: 95 }),
          );
          done();
        });
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, (done) => {
      return request(server)
        [method](
          PATH +
            '?join=pricingModel&join=priceTiers&join=priceTiers.unitTier&s={"$and":[{"productName":{"$contL":""}},{"productAvailability":{"$in":["{Current, Retired}", "{Current}", "{Retired}"]}},null]}',
        )
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

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async (done) => {
      comparedData = await factory(entityData)().make();
      comparedData.shadingRuleLogic = JSON.stringify(
        comparedData.shadingRuleLogic,
      );
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

  describe(`${METHODS.POST.toUpperCase()} ${PATH}/:id/clone`, () => {
    const method = METHODS.POST;
    it(`should clone a ${MODEL}`, async () => {
      const res = await request(server)
        [method](`${PATH}/${receivedData[MODEL_ID]}/clone`)
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toEqual(getMetaData(method).expectedStatus);
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
      const repo = getConnection('MASTER_CONNECTION_CONF').getRepository(
        OemProductsRelationships,
      );
      const productRelationships = await repo.find({ isEnabled: true });
      expect(productRelationships).toHaveLength(0);
      done();
    });
  });
});
