import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';
import { enable } from 'async-local-storage';
import { getConnection, getConnectionManager, EntityManager } from 'typeorm';
import * as _ from 'lodash';

import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import CreateOemCompanies from '../oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../oem/seeds/create-oem-roles.seed';
import CreateOemUsers from '../oem/seeds/create-oem-users.seed';
import { OemQuoteEntity } from '../oem/main/oem-quotes/oem-quote.entity';
import { OemQuoteSerializeDto } from '../oem/main/oem-quotes/oem-quote.dto/oem-quote.serialize.dto';
import CreateOemCustomer from '../oem/seeds/create-oem-customer.seed';
import { clearDB } from '../utils/clear-db.util';
import CreateOemAddresses from '../oem/seeds/create-oem-addresses.seed';
import CreateOemHierarchyLevels from '../oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../oem/seeds/create-oem-hierarchies.seed';
import CreateOemContacts from '../oem/seeds/create-oem-contacts.seed';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';
import { QuoteStatusEnum } from '../oem/main/oem-quotes/oem-quote.enums/quote-status.enum';
import CreateOemProducts from '../oem/seeds/create-oem-products.seed';
import CreateOemPriceTiers from '../oem/seeds/create-oem-price-tiers.seed';
import CreateOemPricingModels from '../oem/seeds/create-oem-pricing-models.seed';
import CreateOemMaterials from '../oem/seeds/create-oem-materials.seed';
import CreateOemQuotesProducts from '../oem/seeds/create-oem-quotes-products.seed';
import CreateOemQuotesMaterials from '../oem/seeds/create-oem-quotes-materials.seed';
import CreateOemUnitTiers from '../oem/seeds/create-oem-unit-tiers.seed';
import CreateOemQuotesUsers from '../oem/seeds/create-oem-quotes-users.seed';
import { OemQuotesProducts } from '../oem/intermediaries/_oem-quotes-products/oem-quotes-products.entity';
import { OemQuotesMaterials } from '../oem/intermediaries/_oem-quotes-materials/oem-quotes-materials.entity';
import { OemQuotesUsers } from '../oem/intermediaries/_oem-quotes-users/oem-quotes-users.entity';

describe('QuotesController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let quote: OemQuoteEntity;

  // dynamic data
  const EntityClass = OemQuoteEntity;
  const SerializeClass = OemQuoteSerializeDto;
  let receivedData: OemQuoteSerializeDto;
  let comparedData: OemQuoteEntity;

  const PATH = '/quotes';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'quote';

  const PATH_ACTION_LOGS = '/action-logs';
  const MODEL_ACTION_LOGS = 'actionLog';

  const getMetaData = (method: string) => {
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

  beforeAll(async () => {
    enable();

    await initPolicy();
    await useSeeding();

    await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemUsers);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemCustomer);
    await runSeeder(CreateOemContacts);
    quote = await factory(OemQuoteEntity)().make();
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();

    comparedData = quote;
    console.debug(quote);

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
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);

      expect(res.body.data[0]).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
    });
  });

  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    beforeAll(async () => {
      const repo = getConnection('MASTER_CONNECTION_CONF').getRepository(
        OemQuoteEntity,
      );
      await repo.update(receivedData.quoteId, {
        quoteStatus: QuoteStatusEnum.EXPIRED,
        isLocked: true,
      });
    });

    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + receivedData.quoteId)
        .send({
          quoteName: 'Test',
          quoteStatus: QuoteStatusEnum.DRAFT,
        })
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);

      console.debug(res.body);

      expect(res.body.data).toEqual(
        expect.objectContaining({
          quoteName: 'Test',
          daysSinceSubmission: '0 day(s)',
          isLocked: false,
        }),
      );
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH_ACTION_LOGS}`, () => {
    const method = METHODS.GET;
    it(`should ${
      getMetaData(method).action
    } a ${MODEL_ACTION_LOGS}`, async () => {
      const res = await request(server)
        [method](PATH_ACTION_LOGS)
        .set('Origin', 'demo.localhost')
        .expect(getMetaData(method).expectedStatus);
      console.debug(res.body);
      expect(res.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'Quote',
            association: expect.objectContaining({
              quoteName: 'Test',
            }),
            subject: { userId: 1 },
            action: 'Update',
          }),
        ]),
      );
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      comparedData = await factory(EntityClass)().make();

      const res = await request(server)
        [method](PATH + '/' + receivedData.quoteId)
        .set('Origin', 'demo.localhost')
        .send(comparedData);
      console.debug(res.body);
      expect(res.status).toEqual(getMetaData(method).expectedStatus);

      expect(res.body.data).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
    });
  });

  describe(`${METHODS.POST.toUpperCase()} ${PATH}/:id/clone`, () => {
    let manager: EntityManager;
    let newQuote: OemQuoteEntity;
    let quoteProducts: OemQuotesProducts[];
    let quoteMaterials: OemQuotesMaterials[];
    let quoteUser: OemQuotesUsers;

    beforeAll(async () => {
      manager = getConnection('MASTER_CONNECTION_CONF').manager;

      await runSeeder(CreateOemMaterials);
      await runSeeder(CreateOemPricingModels);
      await runSeeder(CreateOemUnitTiers);
      await runSeeder(CreateOemProducts);
      await runSeeder(CreateOemPriceTiers);
      quoteProducts = await runSeeder(CreateOemQuotesProducts);
      quoteMaterials = await runSeeder(CreateOemQuotesMaterials);
      quoteUser = await runSeeder(CreateOemQuotesUsers);
    });

    afterAll(async () => {
      await manager.delete(OemQuotesProducts, {
        quoteId: newQuote.quoteId,
      });
      await manager.delete(OemQuotesMaterials, {
        quoteId: newQuote.quoteId,
      });
      await manager.delete(OemQuotesUsers, {
        quoteId: newQuote.quoteId,
      });
    });

    const method = METHODS.POST;
    it(`should clone a ${MODEL}`, async () => {
      const oldQuoteProductsBefore = await manager.find(OemQuotesProducts, {
        quoteId: receivedData.quoteId,
      });
      const res = await request(server)
        [method](`${PATH}/${receivedData.quoteId}/clone`)
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toEqual(200);

      newQuote = await manager.findOne(OemQuoteEntity, res.body.data.quoteId);
      expect(res.body.data.opportunityId).toEqual(newQuote.opportunityId);

      const oldQuoteProductsAfter = await manager.find(OemQuotesProducts, {
        quoteId: receivedData.quoteId,
      });

      expect(oldQuoteProductsBefore.length).toEqual(
        oldQuoteProductsAfter.length,
      );

      const newQuoteProducts = await manager.find(OemQuotesProducts, {
        quoteId: newQuote.quoteId,
      });

      const newQuoteMaterials = await manager.find(OemQuotesMaterials, {
        quoteId: newQuote.quoteId,
      });
      expect(newQuoteProducts.length).toEqual(quoteProducts.length);
      expect(newQuoteMaterials.length).toEqual(quoteMaterials.length);

      const newQuoteUser = await manager.find(OemQuotesUsers, {
        quoteId: newQuote.quoteId,
      });
      const quoteUsersRepo = manager.getRepository(OemQuotesUsers);
      expect(quoteUsersRepo.create(quoteUser)).toEqual(
        expect.objectContaining(
          quoteUsersRepo.create(
            _.omit(newQuoteUser, ['quoteId', 'createdAt', 'updatedAt']),
          ),
        ),
      );
    });
  });

  describe(`${METHODS.POST.toUpperCase()} ${PATH}/bulk-clone`, () => {
    let manager: EntityManager;
    let newQuote: OemQuoteEntity;
    let quoteProducts: OemQuotesProducts[];
    let quoteMaterials: OemQuotesMaterials[];
    let quoteUser: OemQuotesUsers;

    beforeAll(async () => {
      manager = getConnection('MASTER_CONNECTION_CONF').manager;

      await runSeeder(CreateOemMaterials);
      await runSeeder(CreateOemPricingModels);
      await runSeeder(CreateOemUnitTiers);
      await runSeeder(CreateOemProducts);
      await runSeeder(CreateOemPriceTiers);
      quoteProducts = await runSeeder(CreateOemQuotesProducts);
      quoteMaterials = await runSeeder(CreateOemQuotesMaterials);
      quoteUser = await runSeeder(CreateOemQuotesUsers);
    });

    afterAll(async () => {
      await manager.delete(OemQuotesProducts, {
        quoteId: newQuote.quoteId,
      });
      await manager.delete(OemQuotesMaterials, {
        quoteId: newQuote.quoteId,
      });
      await manager.delete(OemQuotesUsers, {
        quoteId: newQuote.quoteId,
      });
    });

    const method = METHODS.POST;
    it(`should clone a ${MODEL}`, async () => {
      const oldQuoteProductsBefore = await manager.find(OemQuotesProducts, {
        quoteId: receivedData.quoteId,
      });
      console.debug({ oldQuoteProductsBefore });
      const res = await request(server)
        [method](`${PATH}/bulk-clone`)
        .set('Origin', 'demo.localhost')
        .send({
          bulk: [{ quoteId: 1 }, { quoteId: 2 }],
        });

      console.debug(res.body);
      expect(res.status).toEqual(200);

      newQuote = await manager.findOne(
        OemQuoteEntity,
        res.body.data[0].quoteId,
      );
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    let manager: EntityManager;
    const method = METHODS.DELETE;

    beforeAll(async () => {
      manager = getConnection('MASTER_CONNECTION_CONF').manager;
    });

    it(`should not ${
      getMetaData(method).action
    } a transacted ${MODEL}`, async () => {
      await manager.update(
        OemQuoteEntity,
        {
          quoteId: receivedData.quoteId,
        },
        {
          quoteStatus: QuoteStatusEnum.TRANSACTED,
        },
      );

      const res = await request(server)
        [method](PATH + '/' + receivedData.quoteId)
        .set('Origin', 'demo.localhost');
      // console.debug(res.body);
      expect(res.status).toEqual(403); // Forbidden resource
    });

    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      await manager.update(
        OemQuoteEntity,
        {
          quoteId: receivedData.quoteId,
        },
        {
          quoteStatus: QuoteStatusEnum.DRAFT,
        },
      );

      const res = await request(server)
        [method](PATH + '/' + receivedData.quoteId)
        .set('Origin', 'demo.localhost');
      // console.debug(res.body);
      expect(res.status).toEqual(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.POST.toUpperCase()} ${PATH}/bulk-delete`, () => {
    let manager: EntityManager;
    const method = METHODS.POST;

    beforeAll(async () => {
      manager = getConnection('MASTER_CONNECTION_CONF').manager;
    });

    it(`should delete bulk ${MODEL}`, async () => {
      await manager.update(
        OemQuoteEntity,
        {},
        {
          quoteStatus: QuoteStatusEnum.DRAFT,
          isEnabled: true,
        },
      );

      const res = await request(server)
        [method](PATH + '/bulk-delete')
        .set('Origin', 'demo.localhost')
        .send({
          bulk: [{ quoteId: 1 }, { quoteId: 2 }],
        });

      console.debug(res.body);
      expect(res.status).toEqual(200);
    });
  });
});
