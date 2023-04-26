import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { useContainer } from 'class-validator';
import CreateOemCompanies from '../oem/seeds/create-oem-companies.seed';
import { clearDB } from '../utils/clear-db.util';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';

import { closeAllConnection } from '../test.utils/close-all-connections.util';
import { OemSalesforceIntegrationDto } from '../oem/main/oem-integrations/oem-salesforce-integrations/oem-salesforce-integration.dto/oem-salesforce-integration.dto';
import * as _ from 'lodash';
import initCrudTesting from '../test.utils/init-crud-tests.util';
import { initDefer } from '../utils/init-defer.util';

describe('SalesforceIntegration (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  const PATH = '/salesforce-integrations';
  const updateData = {
    salesforceClientSecret: 'Test',
  };
  const deferPath = initDefer();

  const { defers, tests } = initCrudTesting({ path: PATH });
  const { deferServer, deferComparedData, deferSentData } = defers;

  const [
    DESCRIBE_GET_ALL,
    DESCRIBE_GET,
    DESCRIBE_POST,
    DESCRIBE_PATCH,
    DESCRIBE_PUT,
    DESCRIBE_DELETE,
  ] = tests;

  beforeAll(async (done) => {
    await initPolicy();
    await useSeeding();
    await runSeeder(CreateOemCompanies);
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();
    const sentData = await factory(OemSalesforceIntegrationDto)().make({
      salesforceIntegrationId: 1,
    });
    const comparedData = _.omit(sentData, [
      'salesforceClientSecret',
      'salesforcePassword',
    ]);
    await app.init();
    server = app.getHttpServer();
    deferServer.resolve(server);
    deferComparedData.resolve(comparedData);
    deferSentData.resolve(sentData);
    deferPath.resolve(PATH + '/' + comparedData.salesforceIntegrationId);
    done();
  });

  afterAll(async () => {
    await clearDB();
    await closeAllConnection();
    await app.close();
    global.gc && global.gc();
  });

  DESCRIBE_POST(deferComparedData.get(), deferSentData.get() );

  DESCRIBE_GET(deferComparedData.get());

  DESCRIBE_GET_ALL(deferComparedData.get());

  DESCRIBE_PATCH(
    { salesforceClientSecretLast4: 'Test' },
    updateData,
    deferPath.get(),
  );

  DESCRIBE_PUT(deferComparedData.get(), deferSentData.get(), deferPath.get());
  DESCRIBE_DELETE(null, null, deferPath.get());
});
