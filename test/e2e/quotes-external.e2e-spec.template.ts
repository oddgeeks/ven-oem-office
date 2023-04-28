// Dependencies
import { TestingModule } from '@nestjs/testing';
import { factory, useSeeding } from 'typeorm-seeding';
import * as _ from 'lodash';
import { getConnection } from 'typeorm';
import { INestTestApp } from '../test.interfaces/nest-test-app.interface';

// Seeds
import { createDemoOemCompaniesSeed } from '../../src/oem/seeds/demo.seeds/create-demo-oem-companies.seed';
import { createDemoOemRolesSeed } from '../../src/oem/seeds/demo.seeds/create-demo-oem-roles.seed';
import { createDemoOemHierarchyLevelsSeed } from '../../src/oem/seeds/demo.seeds/create-demo-oem-hierarchy-levels.seed';
import { createDemoOemHierarchiesSeed } from '../../src/oem/seeds/demo.seeds/create-demo-oem-hierarchies.seed';
import { createDemoOemUsersSeed } from '../../src/oem/seeds/demo.seeds/create-demo-oem-users.seed';
import { createDemoOemAddressesSeed } from '../../src/oem/seeds/demo.seeds/create-demo-oem-addresses.seed';
import { createDemoOemCustomersSeed } from '../../src/oem/seeds/demo.seeds/create-demo-oem-customers.seed';
import { createDemoOemContactsSeed } from '../../src/oem/seeds/demo.seeds/create-demo-oem-contacts.seed';

// Entities
import { OemQuoteEntity } from '../../src/oem/main/oem-quotes/oem-quote.entity';
import { OemRecentlyViewedQuotesVendos } from '../../src/oem/intermediaries/_oem-recently-viewed-quotes-vendos/oem-recently-viewed-quotes-vendos.entity';
import { OemExternalUserEntity } from '../../src/oem/main/oem-external-users/oem-external-user.entity';
import { OemQuotesExternalUsers } from '../../src/oem/intermediaries/_oem-qv-external-users/oem-quotes-external-users/oem-quotes-external-users.entity';

// Enums
import { METHODS } from '../test.enums/methods.enum';
import { QuoteStatusEnum } from '../../src/oem/main/oem-quotes/oem-quote.enums/quote-status.enum';

// Services
import { AuthService } from '../../src/auth/auth.service';

// Utils
import { initNestTestApp } from '../test.utils/init-nest-app.util';
import initCrudTesting from '../test.utils/init-crud-tests.util';
import { clearDB } from '../../src/utils/clear-db.util';
import initModuleFixture from '../test.utils/init-module-fixture.util';
import { initPolicy } from '../test.utils/init-policy.util';
import { closeAllConnection } from '../test.utils/close-all-connections.util';
import { initDefer } from '../../src/utils/init-defer.util';
import { RunMultipleSeeds } from '../../src/oem/seeds/seed.utils/run-multiple-seeds.util';

describe('QuotesExternalController (e2e)', () => {
  jest.setTimeout(50000);
  let NestAppTest: INestTestApp;
  let comparedData: Partial<OemQuoteEntity>;
  const updateData: Partial<OemQuoteEntity> = {
    quoteName: 'Test',
    quoteStatus: QuoteStatusEnum.TRANSACTED,
  };

  const pinCode = '123456';
  const PATH = '/quotes.external';

  const { defers, tests } = initCrudTesting({
    path: PATH,
    only: {
      ['QUOTES_GET_ONE']: { method: METHODS.GET, path: PATH + '/1' },
      ['QUOTES_PATCH']: {
        path: PATH + '/1',
        method: METHODS.PATCH,
        message: 'should transact quote',
      },
      ['QUOTES_VERIFY_PIN_CODE']: {
        path: PATH + '/1/pin-code/verify',
        method: METHODS.POST,
      },
    },
  });
  const { deferServer, deferComparedData, deferSentData } = defers;

  const deferSentPinCode = initDefer();

  const {
    DESCRIBE_QUOTES_GET_ONE,
    DESCRIBE_QUOTES_PATCH,
    DESCRIBE_QUOTES_VERIFY_PIN_CODE,
  } = tests;

  beforeAll(async () => {
    await initPolicy();
    await useSeeding();
    const moduleFixture: TestingModule = await initModuleFixture().compile();
    NestAppTest = await initNestTestApp(moduleFixture);

    const [
      companies,
      roles,
      hierarchyLevels,
      hierarchies,
      users,
      addresses,
      customers,
      contacts,
    ] = await RunMultipleSeeds([
      createDemoOemCompaniesSeed(),
      createDemoOemRolesSeed(),
      createDemoOemHierarchyLevelsSeed(),
      createDemoOemHierarchiesSeed(),
      createDemoOemUsersSeed(),
      createDemoOemAddressesSeed(),
      createDemoOemCustomersSeed(),
      createDemoOemContactsSeed(),
    ]);

    comparedData = await factory(OemQuoteEntity)().create({
      pinCode,
    });

    const authService = moduleFixture.get<AuthService>(AuthService);

    const admin = await factory(OemExternalUserEntity)().create({
      externalUserId: 1,
      companyId: 1,
      firstName: 'Admin',
      lastName: 'Vendori',
      email: 'admin@admin.com',
    });

    const quoteExternalUsers = await factory(OemQuotesExternalUsers)().create({
      externalUserId: 1,
      quoteId: 1,
      companyId: 1,
    });

    console.log(quoteExternalUsers);

    const access_token_admin = (await authService.loginExternalUser(admin))
      .access_token;

    deferServer.resolve(NestAppTest.server);
    deferSentData.resolve({
      access_token: access_token_admin,
      body: updateData,
    });
    // TODO: we need to use automatic mapper - https://www.npmjs.com/package/@automapper/core
    deferComparedData.resolve(
      _.pick(comparedData, ['quoteName', 'quoteStatus']),
    );
  });

  afterAll(async () => {
    await clearDB();
    await closeAllConnection();
    await NestAppTest.app.close();
    global.gc && global.gc();
  });

  DESCRIBE_QUOTES_GET_ONE(
    deferComparedData.get(),
    deferSentData.get(),
    null,
    async ({ data }) => {
      const repo = getConnection('MASTER_CONNECTION_CONF').getRepository(
        OemRecentlyViewedQuotesVendos,
      );
      // TODO: we do not collect recentlyViewed for external users now, but probably should do
      /* const recentlyViewed = await repo.findOne({
         where: {
           quoteId: data.quoteId,
           userId: 1,
         },
       });
       expect(recentlyViewed).toBeDefined();*/
    },
  );

  DESCRIBE_QUOTES_PATCH(updateData, deferSentData.get(), null, (data) => {
    deferSentPinCode.resolve({
      access_token: data?.sentData?.access_token,
      body: { pinCode },
    });
  });

  DESCRIBE_QUOTES_VERIFY_PIN_CODE({ success: true }, deferSentPinCode.get());
});
