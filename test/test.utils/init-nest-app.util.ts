import { useContainer } from 'class-validator';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
//Temporary removed (should be back from due merging refactoring branch)
//import { ExtendedValidationPipe } from '../../src/common/pipes/extended-validation.pipe';
//import { StripContextPipe } from '../../src/common/pipes/strip-context.pipe';
import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import { INestTestApp } from '../test.interfaces/nest-test-app.interface';

export async function initNestTestApp(
  moduleFixture: TestingModule,
): Promise<INestTestApp> {
  const app: INestApplication = moduleFixture.createNestApplication();
  useContainer(app, { fallbackOnErrors: true });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  //app.useGlobalPipes(new ExtendedValidationPipe(), new StripContextPipe());

  await app.init();
  const server: AbstractHttpAdapter = app.getHttpServer();
  return { app, server };
}
