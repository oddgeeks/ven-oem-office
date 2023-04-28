import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { useContainer } from 'class-validator';
import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';

import { closeAllConnection } from '../test.utils/close-all-connections.util';

import * as _ from 'lodash';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemUsers from '../../src/oem/seeds/create-oem-users.seed';
import CreateOemPricingModels from '../../src/oem/seeds/create-oem-pricing-models.seed';
import CreateOemUnitTiers from '../../src/oem/seeds/create-oem-unit-tiers.seed';
import CreateOemProducts from '../../src/oem/seeds/create-oem-products.seed';
import { OemBundleEntity } from '../../src/oem/main/oem-bundles/oem-bundle.entity';
import initCrudTesting from '../test.utils/init-crud-tests.util';
import { initDefer } from '../../src/utils/init-defer.util';

describe('Bundle (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  const PATH = '/bundles';
  const deferPath = initDefer();
  const deferComparedClone = initDefer();
  let sentData;

  const { defers, tests } = initCrudTesting({ path: PATH });
  const { deferServer, deferComparedData, deferSentData } = defers;

  const {
    DESCRIBE_GET_ALL,
    DESCRIBE_GET,
    DESCRIBE_POST,
    DESCRIBE_PATCH,
    DESCRIBE_PUT,
    DESCRIBE_DELETE,
  } = tests;

  beforeAll(async (done) => {
    await initPolicy();
    await useSeeding();

    await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemUsers);
    await runSeeder(CreateOemPricingModels);
    await runSeeder(CreateOemUnitTiers);
    const products = await runSeeder(CreateOemProducts);
    sentData = await factory(OemBundleEntity)().make({
      products: products.map((item) => {
        return { productId: item.productId };
      }),
    });
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();
    const comparedData = _.omit(sentData, [
      'productName',
      'createdAt',
      'updatedAt',
      'products',
      'bundleSettings',
    ]);
    console.log(comparedData);
    await app.init();
    server = app.getHttpServer();
    deferServer.resolve(server);
    deferComparedData.resolve(comparedData);
    deferSentData.resolve(sentData);
    deferComparedClone.resolve({
      bundleName: 'Cloned from ' + sentData.bundleName,
    });

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
    (response) => deferPath.resolve(PATH + '/' + response.data.bundleId),
  );
  DESCRIBE_GET(deferComparedData.get(), null, deferPath.get());
  DESCRIBE_GET_ALL(
    deferComparedData.get(),
    null,
    /*PATH +
      '?join=products' +
      '&join=products.priceTiers' +
      '&join=products.priceTiers.unitTier' +
      '&join=products.pricingModel' +
      '&or=bundleName||%24contL||Subt',*/
  );
  DESCRIBE_PATCH(
    {},
    {
      bundleName: 'Test',
      bundleSettings: [{ productId: 1, defaultQuantity: 1, is_editable: true }],
    },
    deferPath.get(),
  );
  DESCRIBE_PUT(deferComparedData.get(), deferSentData.get(), deferPath.get());
  DESCRIBE_POST(deferComparedClone.get(), {}, `${PATH}/8/clone`);
  DESCRIBE_DELETE(null, null, deferPath.get());
});
