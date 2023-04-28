import { TestingModule } from '@nestjs/testing';
import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';
import { enable } from 'async-local-storage';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';
import CreateOemContacts from '../../src/oem/seeds/create-oem-contacts.seed';

import CreateOemQuotes from '../../src/oem/seeds/create-oem-quotes.seed';
import { DiscountRuleTypeEnum } from '../../src/oem/main/oem-rules/oem-discount-rules/oem-discount-rule.enums/discount-rule.enum';
import CreateOemDiscountListPrices from '../../src/oem/seeds/create-oem-visible-product-fields.seed';
import { OemDiscountRuleEntity } from '../../src/oem/main/oem-rules/oem-discount-rules/oem-discount-rule.entity';
import { OemDiscountRuleSerializeDto } from '../../src/oem/main/oem-rules/oem-discount-rules/oem-discount-rule.dto/oem-discount-rule.serialize.dto';
import initModuleFixture from '../test.utils/init-module-fixture.util';

import { initPolicy } from '../test.utils/init-policy.util';
import { ActionLogTypeEnum } from '../../src/oem/main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { initTestDescription } from '../test.utils/init-test.util';
import { METHODS } from '../test.enums/methods.enum';
import { getMetaData } from '../test.utils/get-metadata.util';
import { initDefer } from '../../src/utils/init-defer.util';
import { ActionsEnum } from '../../src/oem/main/oem-action-logs/oem-action-log.enums/actions.enum';

describe('DiscountRulesController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  const deferServer = initDefer();
  let server: Promise<HttpServer> = deferServer.get();
  let discountRule: OemDiscountRuleEntity;

  const MODEL = 'discountRule';
  const MODEL_ID = `${MODEL}Id`;

  // dynamic data
  const entityData: any = OemDiscountRuleEntity;
  const SerializeClass: any = OemDiscountRuleSerializeDto;
  let receivedData: OemDiscountRuleSerializeDto;
  let comparedData: any;

  const PATH = '/discount-rules';
  const PATCH_TEST = { discountRuleType: DiscountRuleTypeEnum.CHANNEL };

  const DESCRIBE_ACTION_LOGS_GET = initTestDescription({
    httpServer: deferServer.get(),
    method: METHODS.GET,
    path: '/action-logs?join=discountRule&filter=association.discountRuleId||$eq||1',
  });

  beforeAll(async (done) => {
    enable();
    await initPolicy();
    await useSeeding();
    await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemUsers);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemCustomer);
    await runSeeder(CreateOemContacts);
    await runSeeder(CreateOemQuotes);
    await runSeeder(CreateOemDiscountListPrices);
    discountRule = await factory(OemDiscountRuleEntity)().make();
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();
    comparedData = discountRule;
    console.debug('comparedData', comparedData);
    await app.init();
    server = app.getHttpServer();
    deferServer.resolve(server);
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

  DESCRIBE_ACTION_LOGS_GET({
    type: ActionLogTypeEnum.DISCOUNT_RULES,
    association: expect.objectContaining({
      ...PATCH_TEST,
    }),
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async (done) => {
      comparedData = await factory(entityData)().make();
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
      done();
    });
  });

  DESCRIBE_ACTION_LOGS_GET({
    type: ActionLogTypeEnum.DISCOUNT_RULES,
    action: ActionsEnum.DELETE,
  });
});
