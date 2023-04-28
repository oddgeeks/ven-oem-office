import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { factory, runSeeder, useSeeding } from 'typeorm-seeding';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { useContainer } from 'class-validator';
import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemRoles from '../../src/oem/seeds/create-oem-roles.seed';
import { clearDB } from '../../src/utils/clear-db.util';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemChannels from '../../src/oem/seeds/create-oem-channels.seed';
import CreateOemCompanyPrograms from '../../src/oem/seeds/create-oem-company-programs.seed';
import CreateOemCompanyChannels from '../../src/oem/seeds/create-oem-company-channels.seed';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';
import CreateOemCustomer from '../../src/oem/seeds/create-oem-customer.seed';
import CreateOemContacts from '../../src/oem/seeds/create-oem-contacts.seed';
import CreateOemLicensingPrograms from '../../src/oem/seeds/create-oem-licensing-programs.seed';
import { initTestDescription } from '../test.utils/init-test.util';
import { METHODS } from '../test.enums/methods.enum';
import { OemExternalUserEntity } from '../../src/oem/main/oem-external-users/oem-external-user.entity';
import { initDefer } from '../../src/utils/init-defer.util';
import { closeAllConnection } from '../test.utils/close-all-connections.util';

describe('ExternalUsersController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let comparedData: object;
  const updateData = {
    firstName: 'Test',
  };

  const deferServer = initDefer();
  const deferComparedData = initDefer();

  const DESCRIBE_EXTERNAL_USERS_GET = initTestDescription({
    httpServer: deferServer.get(),
    method: METHODS.GET,
    path: '/external-users',
  });

  const DESCRIBE_EXTERNAL_USERS_POST = initTestDescription({
    httpServer: deferServer.get(),
    method: METHODS.POST,
    path: '/external-users',
  });

  const DESCRIBE_EXTERNAL_USERS_PATCH = initTestDescription({
    httpServer: deferServer.get(),
    method: METHODS.PATCH,
    path: '/external-users/1',
  });

  const DESCRIBE_EXTERNAL_USERS_PUT = initTestDescription({
    httpServer: deferServer.get(),
    method: METHODS.PUT,
    path: '/external-users/1',
  });

  const DESCRIBE_EXTERNAL_USERS_DELETE = initTestDescription({
    httpServer: deferServer.get(),
    method: METHODS.DELETE,
    path: '/external-users/1',
  });

  beforeAll(async (done) => {
    await initPolicy();
    await useSeeding();
    await runSeeder(CreateOemCompanies);
    await runSeeder(CreateOemRoles());
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemCustomer);
    await runSeeder(CreateOemContacts);
    await runSeeder(CreateOemChannels);
    await runSeeder(CreateOemCompanyPrograms);
    await runSeeder(CreateOemLicensingPrograms);
    await runSeeder(CreateOemCompanyChannels);
    await runSeeder(CreateOemHierarchyLevels);
    await runSeeder(CreateOemHierarchies);
    await runSeeder(CreateOemAddresses);
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();
    comparedData = await factory(OemExternalUserEntity)().make({
      externalUserId: 1,
    });
    await app.init();
    server = app.getHttpServer();
    deferServer.resolve(server);
    deferComparedData.resolve(comparedData);
    done();
  });

  afterAll(async () => {
    await clearDB();
    await closeAllConnection();
    await app.close();
    global.gc && global.gc();
  });

  DESCRIBE_EXTERNAL_USERS_POST(
    deferComparedData.get(),
    deferComparedData.get(),
  );

  DESCRIBE_EXTERNAL_USERS_GET(deferComparedData.get());

  DESCRIBE_EXTERNAL_USERS_PATCH(updateData, updateData);

  DESCRIBE_EXTERNAL_USERS_PUT(deferComparedData.get(), deferComparedData.get());

  DESCRIBE_EXTERNAL_USERS_DELETE();
});
