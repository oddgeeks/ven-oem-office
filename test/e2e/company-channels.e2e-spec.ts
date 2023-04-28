import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { runSeeder, useSeeding } from 'typeorm-seeding';
import { useContainer } from 'class-validator';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';

import { OemCompanyEntity } from '../../src/oem/main/oem-companies/oem-company.entity';
import { OemChannelEntity } from '../../src/oem/main/oem-channels/oem-channel.entity';
import { OemCompanyProgram } from '../../src/oem/intermediaries/_oem-company-programs/oem-company-program.entity';
import { OemHierarchyEntity } from '../../src/oem/main/oem-hierarchies/oem-hierarchy.entity';
import { OemCompanyChannelSerializeDto } from '../../src/oem/intermediaries/_oem-company-channels/oem-company-channel.dto/oem-company-channel.serialize.dto';
import { ChannelTypeEnum } from '../../src/oem/intermediaries/_oem-company-channels/oem-company-channel.enums/channel-type.enum';

import CreateOemCompanies from '../../src/oem/seeds/create-oem-companies.seed';
import CreateOemChannels from '../../src/oem/seeds/create-oem-channels.seed';
import CreateOemCompanyPrograms from '../../src/oem/seeds/create-oem-company-programs.seed';
import CreateOemLicensingPrograms from '../../src/oem/seeds/create-oem-licensing-programs.seed';
import CreateOemHierarchies from '../../src/oem/seeds/create-oem-hierarchies.seed';
import CreateOemHierarchyLevels from '../../src/oem/seeds/create-oem-hierarchy-levels.seed';
import CreateOemAddresses from '../../src/oem/seeds/create-oem-addresses.seed';

import { clearDB } from '../../src/utils/clear-db.util';
import { enable } from 'async-local-storage';
import { initPolicy } from '../test.utils/init-policy.util';
import { closeAllConnection } from '../test.utils/close-all-connections.util';
import initModuleFixture from '../test.utils/init-module-fixture.util';

enable();

describe('CompanyChannelsController (e2e)', () => {
  jest.setTimeout(50000);
  let app: INestApplication;
  let server: any;
  let company: OemCompanyEntity;
  let channel: OemChannelEntity;
  let companyProgram: OemCompanyProgram;
  let companyChannel: any;
  let geoHierarchy: OemHierarchyEntity;
  let comparedData: OemCompanyChannelSerializeDto;
  const SerializeClass = OemCompanyChannelSerializeDto;

  const PATH = '/company-channels';
  const METHODS = {
    POST: 'post',
    GET: 'get',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  const MODEL = 'companyChannel';

  const PATCH_DATA = {
    channelType: ChannelTypeEnum.DISTRIBUTOR,
    isActive: false,
  };
  const PUT_DATA = {
    channelType: ChannelTypeEnum.RESELLER,
    isActive: false,
  };

  const getMetaData = (method: string) => {
    let action: string;
    let expectedStatus: number;
    switch (method) {
      case 'post':
        action = 'return';
        expectedStatus = 201;
        break;
      case 'get':
        action = 'retrieve';
        expectedStatus = 200;
        break;
      case 'patch':
        action = 'return';
        expectedStatus = 200;
        break;
      case 'put':
        action = 'replace';
        expectedStatus = 200;
        break;
      case 'delete':
        action = 'return';
        expectedStatus = 200;
        break;
    }
    return { action, expectedStatus };
  };

  beforeAll(async () => {
    await initPolicy();
    await useSeeding();
    company = await runSeeder(CreateOemCompanies);
    channel = (await runSeeder(CreateOemChannels))[0];
    companyProgram = await runSeeder(CreateOemCompanyPrograms);
    await runSeeder(CreateOemLicensingPrograms);
    await runSeeder(CreateOemAddresses);
    await runSeeder(CreateOemHierarchyLevels);
    geoHierarchy = await runSeeder(CreateOemHierarchies);
    companyChannel = {
      companyId: company.companyId,
      channelId: channel.channelId,
      geoHierarchyId: geoHierarchy.hierarchyId,
      companyProgramId: companyProgram.companyProgramId,
      channelType: ChannelTypeEnum.RESELLER,
    };
    comparedData = companyChannel;
    const moduleFixture: TestingModule = await initModuleFixture().compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes();

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await clearDB();
    await closeAllConnection();
    await app.close();
    global.gc && global.gc();
  });

  describe(`${METHODS.POST.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.POST;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send(comparedData);
      console.debug(res.body);
      comparedData = res.body.data;
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.POST.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.POST;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost')
        .send({ ...companyChannel, channelId: 1, companyProgramId: 1 });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} a ${MODEL}`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);

      expect(res.body.data).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
    });
  });

  describe(`${METHODS.GET.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.GET;
    it(`should ${getMetaData(method).action} ${MODEL}s`, async () => {
      const res = await request(server)
        [method](PATH)
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data[0]).toEqual(
        expect.objectContaining(new SerializeClass(comparedData)),
      );
    });
  });

  describe(`${METHODS.PATCH.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PATCH;
    it(`should ${getMetaData(method).action} error`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...PATCH_DATA });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });

  describe(`${METHODS.PUT.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.PUT;
    it(`should ${getMetaData(method).action} error`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost')
        .send({ ...comparedData, ...PUT_DATA });
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
      expect(res.body.data).toEqual(expect.objectContaining({ ...PUT_DATA }));
    });
  });

  describe(`${METHODS.DELETE.toUpperCase()} ${PATH}`, () => {
    const method = METHODS.DELETE;
    it(`should ${getMetaData(method).action} error`, async () => {
      const res = await request(server)
        [method](PATH + '/' + comparedData[`${MODEL}Id`])
        .set('Origin', 'demo.localhost');
      console.debug(res.body);
      expect(res.status).toBe(getMetaData(method).expectedStatus);
    });
  });
});
