import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { enable } from 'async-local-storage';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';

import { OemProductEntity } from '../../src/oem/main/oem-products/oem-product.entity';
import CreateOemProducts from '../../src/oem/seeds/create-oem-products.seed';
import { RelationshipTypeEnum } from '../../src/oem/intermediaries/_oem-products-relationships/oem-products-relationships.enums/relationship-type.enum';
import { EligibleTypeEnum } from '../../src/oem/intermediaries/_oem-products-relationships/oem-products-relationships.enums/eligible-type.enum';
import { ListPriceTypeEnum } from '../../src/oem/intermediaries/_oem-products-relationships/oem-products-relationships.enums/list-price-type.enum';
import CreateOemPricingModels from '../../src/oem/seeds/create-oem-pricing-models.seed';
import CreateOemPriceTiers from '../../src/oem/seeds/create-oem-price-tiers.seed';
import { OemProductsRelationships } from '../../src/oem/intermediaries/_oem-products-relationships/oem-products-relationships.entity';
import CreateOemUnitTiers from '../../src/oem/seeds/create-oem-unit-tiers.seed';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';
import { ActionLogTypeEnum } from '../../src/oem/main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../src/oem/main/oem-action-logs/oem-action-log.enums/actions.enum';
import { initTestDescription } from '../test.utils/init-test.util';
import { METHODS } from '../test.enums/methods.enum';
import { getMetaData } from '../test.utils/get-metadata.util';
import { OemBundleEntity } from '../../src/oem/main/oem-bundles/oem-bundle.entity';
import initCrudTesting from '../test.utils/init-crud-tests.util';
import { closeAllConnection } from '../test.utils/close-all-connections.util';

enable();

describe('ProductsRelationshipsController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let products: OemProductEntity[];
  let productRelationship: OemProductEntity;
  let bundle: OemBundleEntity;

  // dynamic data
  const SerializeClass: any = OemProductsRelationships;
  let receivedData: any;
  let comparedData: any;
  let baseModelData: any;
  let relationModelData: any;

  const PATH = '/product-transitions';

  const BASE_MODEL = 'productRelationship';

  const PUT_DATA = {
    relationshipType: RelationshipTypeEnum.ADD_ON,
    eligibleType: EligibleTypeEnum.UPGRADE,
    listPriceType: ListPriceTypeEnum.FULL_LIST_PRICE,
  };
  const PATCH_DATA = {
    relationshipType: RelationshipTypeEnum.TRANSACTION,
    eligibleType: EligibleTypeEnum.UPGRADE,
    listPriceType: ListPriceTypeEnum.INCREMENTAL,
  };

  const { defers, tests } = initCrudTesting({ path: PATH });
  const { deferServer, deferComparedData, deferPath, deferSentData } = defers;

  const {
    DESCRIBE_GET_ALL,
    DESCRIBE_GET,
    DESCRIBE_POST,
    DESCRIBE_PATCH,
    DESCRIBE_PUT,
    DESCRIBE_DELETE,
  } = tests;

  const DESCRIBE_ACTION_LOGS_GET = initTestDescription({
    httpServer: deferServer.get(),
    method: METHODS.GET,
    path: '/action-logs?join=ProductsRelationships&join=User',
  });

  beforeAll(async (done) => {
    await initPolicy();
    await useSeeding();
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();

    await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemUsers);
    await runSeeder(CreateOemPricingModels);
    await runSeeder(CreateOemUnitTiers);
    products = await runSeeder(CreateOemProducts);
    await runSeeder(CreateOemPriceTiers);
    bundle = await factory(OemBundleEntity)().create({
      products: products,
    });
    productRelationship = await runSeeder(CreateOemProducts);
    baseModelData = bundle;
    relationModelData = productRelationship[0];
    console.debug(baseModelData);
    console.debug(relationModelData);
    comparedData = {
      [`sourceProductId`]: baseModelData.productId,
      [`targetProductId`]: relationModelData.productId,
      ...PUT_DATA,
    };
    await app.init();
    server = app.getHttpServer();
    deferServer.resolve(server);
    deferComparedData.resolve(comparedData);
    deferSentData.resolve(comparedData);
    deferPath.resolve(PATH);
    done();
  });

  afterAll(async () => {
    await clearDB();
    await closeAllConnection();
    await app.close();
    global.gc && global.gc();
  });

  DESCRIBE_POST(
    deferComparedData.get(),
    deferSentData.get(),
    null,
    (response) => {
      receivedData = response.data;
    },
  );

  DESCRIBE_ACTION_LOGS_GET({
    type: ActionLogTypeEnum.PRODUCT_RELATIONSHIPS,
    action: ActionsEnum.CREATE,
    association: expect.objectContaining({
      ...comparedData,
    }),
  });

  DESCRIBE_GET_ALL(
    deferComparedData.get(),
    {},
    PATH +
      '/' +
      '?join=targetBundle' +
      '&join=sourceBundle' +
      '&join[]=sourceBundle.products&join[]=targetBundle.products' +
      '&join[]=sourceProduct&join[]=sourceProduct.pricingModel' +
      '&join[]=targetProduct' +
      '&join[]=targetProduct.pricingModel',
  );
  DESCRIBE_PUT(
    deferComparedData.get(),
    deferSentData.get(),
    PATH + '/1' + '?join[]=sourceProduct&join[]=targetProduct',
    (response) => {
      receivedData = response.data;
    },
  );

  DESCRIBE_GET(
    deferComparedData.get(),
    {},
    PATH +
      '/' +
      1 +
      '?join=targetBundle' +
      '&join=sourceBundle' +
      '&join[]=sourceBundle.products&join[]=targetBundle.products' +
      '&join[]=sourceProduct&join[]=sourceProduct.pricingModel' +
      '&join[]=targetProduct' +
      '&join[]=targetProduct.pricingModel',
    (response) => {
      expect(response.data).toHaveProperty('targetProduct');
      expect(response.data['targetProduct']).toHaveProperty('pricingModel');
      expect(response.data).toHaveProperty('sourceProduct');
      //expect(response.data['sourceProduct']).toHaveProperty('pricingModel');
    },
  );

  DESCRIBE_PATCH(
    { ...PATCH_DATA },
    { ...PATCH_DATA },
    `${PATH}/1`,
    (response) => {
      receivedData = response.data;
    },
  );

  DESCRIBE_POST({ ...PATCH_DATA }, {}, `${PATH}/1/clone`);

  DESCRIBE_DELETE(null, null, `${PATH}/1`);
});
