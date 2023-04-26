import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, getConnectionManager } from 'typeorm';

import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { OemUserEntity } from '../oem/main/oem-users/oem-user.entity';
import { OemRoleEntity } from '../oem/main/oem-roles/oem-role.entity';
import { OemCompanyEntity } from '../oem/main/oem-companies/oem-company.entity';
import { useContainer } from 'class-validator';

import CreateOemCompanies from '../oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../oem/seeds/create-oem-roles.seed';
import CreateOemUsers from '../oem/seeds/create-oem-users.seed';
import { OemQuoteEntity } from '../oem/main/oem-quotes/oem-quote.entity';
import CreateOemCustomer from '../oem/seeds/create-oem-customer.seed';
import { OemCustomerEntity } from '../oem/main/oem-customers/oem-customer.entity';
import { clearDB } from '../utils/clear-db.util';
import CreateOemAddresses from '../oem/seeds/create-oem-addresses.seed';
import { OemAddressEntity } from '../oem/main/oem-addresses/oem-address.entity';
import CreateOemQuotes from '../oem/seeds/create-oem-quotes.seed';
import { OemHierarchyEntity } from '../oem/main/oem-hierarchies/oem-hierarchy.entity';
import CreateOemHierarchies from '../oem/seeds/create-oem-hierarchies.seed';
import { OemHierarchyLevelEntity } from '../oem/main/oem-hierarchy-levels/oem-hierarchy-level.entity';
import { OemQuotesContacts } from '../oem/intermediaries/_oem-quotes-contacts/oem-quotes-contacts.entity';
import CreateOemHierarchyLevels from '../oem/seeds/create-oem-hierarchy-levels.seed';

import { OemProductEntity } from '../oem/main/oem-products/oem-product.entity';
import CreateOemProducts from '../oem/seeds/create-oem-products.seed';
import { PaymentTermEnum } from '../oem/intermediaries/_oem-quotes-customer-products/oem-quotes-customer-products.enums/payment-term.enum';
import CreateOemPricingModels from '../oem/seeds/create-oem-pricing-models.seed';
import CreateOemPriceTiers from '../oem/seeds/create-oem-price-tiers.seed';
import { OemPriceTierEntity } from '../oem/main/oem-price-tiers/oem-price-tier.entity';
import { OemPricingModelEntity } from '../oem/main/oem-pricing-models/oem-pricing-model.entity';
import CreateOemCustomersProducts from '../oem/seeds/create-oem-customers-products.seed';
import { OemCustomersProducts } from '../oem/intermediaries/_oem-customers-products/oem-customers-products.entity';
import CreateOemUnitTiers from '../oem/seeds/create-oem-unit-tiers.seed';
import { OemUnitTierEntity } from '../oem/main/oem-unit-tiers/oem-unit-tier.entity';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';
import { OemBundleEntity } from '../oem/main/oem-bundles/oem-bundle.entity';

describe('QuotesProductsController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let roles: OemRoleEntity;
  let user: OemUserEntity;
  let company: OemCompanyEntity;
  let customer: OemCustomerEntity;
  let address: OemAddressEntity;
  let hierarchy: OemHierarchyEntity;
  let hierarchyLevel: OemHierarchyLevelEntity;
  let products: OemProductEntity[];
  let quote: OemQuoteEntity;
  let pricingModel: OemPricingModelEntity;
  let priceTier: OemPriceTierEntity;
  let unitTier: OemUnitTierEntity;
  let customerProduct: OemCustomersProducts;
  let bundle: OemBundleEntity;

  // dynamic data
  const SerializeClass: any = OemQuotesContacts;
  let receivedData: any;
  let comparedData: any;
  let sendData: any;
  let baseModelData: any;
  let relationModelData: any;

  const PATH = '/quote-products';
  const METHODS = {
    GET: 'get',
    PATCH: 'patch',
    POST: 'post',
    DELETE: 'delete',
  };
  const BASE_MODEL = 'quote';
  const RELATION_MODEL = 'product';

  const PUT_DATA = {
    isLocked: false,
    paymentTerm: PaymentTermEnum.NET_15,
    quantity: 5,
    endDate: new Date(),
    startDate: new Date(),
    customerProductUuid: '123e4567-e89b-12d3-a456-426614174000',
    lockedFields: {
      paid: false,
    },
  };
  const PATCH_DATA = {
    isLocked: true,
    paymentTerm: PaymentTermEnum.NET_10,
    quantity: 10,
    /*endDate: new Date(),
    startDate: new Date(),*/
    lockedFields: {
      paid: true,
    },
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
      case 'post':
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
    address = await runSeeder(CreateOemAddresses);
    customer = await runSeeder(CreateOemCustomer);
    pricingModel = await runSeeder(CreateOemPricingModels);
    unitTier = await runSeeder(CreateOemUnitTiers);
    products = await runSeeder(CreateOemProducts);
    priceTier = await runSeeder(CreateOemPriceTiers);
    quote = await runSeeder(CreateOemQuotes);
    customerProduct = await runSeeder(CreateOemCustomersProducts);
    bundle = await factory(OemBundleEntity)().create({
      products: products,
    });
    baseModelData = quote;
    relationModelData = customerProduct;
    sendData = {
      quoteId: quote.quoteId,
      productId: products[0].productId,
      bundleId: bundle['bundleId'],
      ...PUT_DATA,
    };
    comparedData = {
      ...PUT_DATA,
      quoteId: quote.quoteId,
      productId: null,
      bundleId: bundle['bundleId'],
      customerProductUuid: '123e4567-e89b-12d3-a456-426614174001',
    };
    delete comparedData.startDate;
    delete comparedData.endDate;
    console.debug(bundle);
    console.debug('comparedData', comparedData);
    await app.init();
    server = app.getHttpServer();
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
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} to a ${BASE_MODEL} `, (done) => {
      return request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send({
          ...PUT_DATA,
          quoteId: quote.quoteId,
          productId: products[0].productId,
          //bundleId: bundle.productId,
        })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          const comparedData = {
            ...PUT_DATA,
            quoteId: quote.quoteId,
            productId: products[0].productId,
            //bundleId: bundle.productId
          };
          delete comparedData.startDate;
          delete comparedData.endDate;
          expect(res.body.data).toEqual(
            expect.objectContaining(
              new SerializeClass(comparedData),
            ),
          );
          receivedData = res.body.data;
          done();
        });
    });
  });

  describe(`${METHODS.POST.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.POST;
    it(`should ${
      getMetaData(method).action
    } a ${RELATION_MODEL} to a ${BASE_MODEL} `, (done) => {
      return request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send({
          ...PUT_DATA,
          quoteId: quote.quoteId,
          productId: null,
          bundleId: bundle['bundleId'],
          customerProductUuid: '123e4567-e89b-12d3-a456-426614174001',
        })
        .end((_, res) => {
          console.debug(res.body);
          expect(res.status).toBe(getMetaData(method).expectedStatus);
          expect(res.body.data).toEqual(
            expect.objectContaining(
              new SerializeClass(comparedData),
            ),
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
        [method](
          PATH +
            '/' +
            receivedData.quoteProductId +
            '?join=product&join=bundle&join=bundle.products',
        )
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
          expect(res.body.data[1]).toEqual(
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
        [METHODS.PATCH](PATH + '/' + receivedData.quoteProductId)
        .set('Origin', 'demo.localhost')
        .send({ ...PATCH_DATA })
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
        [method](PATH + '/' + receivedData.quoteProductId)
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      done();
    });
  });
});
