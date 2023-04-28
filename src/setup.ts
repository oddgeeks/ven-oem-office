import {
  ValidationPipe,
  HttpStatus,
  INestApplication,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as connectPgSimple from 'connect-pg-simple';
import * as pg from 'pg';

import { AppModule } from './app.module';
// import { bullRouter } from './queues/queues.router';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';
import * as bodyParser from 'body-parser';
import { writeFile } from 'fs/promises';
import { Reflector } from '@nestjs/core';

export function setup(app: INestApplication): INestApplication {
  app.useGlobalInterceptors(new ResponseInterceptor());
  /*app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    }),
  );*/
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      dismissDefaultMessages: false,
      disableErrorMessages: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.use(cookieParser(process.env.APP_SECRET));
  app.use(bodyParser.json());

  //TODO: better move to environments module
  const pgPool = new pg.Pool({
    host: process.env.DB_MAIN_HOST,
    port: Number(process.env.DB_MAIN_PORT),
    user: process.env.DB_MAIN_USERNAME_MASTER,
    password: process.env.DB_MAIN_PASSWORD_MASTER,
    database: process.env.DB_MAIN_DATABASE,
  });

  app.use(
    session({
      secret: process.env.APP_SECRET as string,
      resave: true,
      saveUninitialized: true,
      store: new (connectPgSimple(session))({
        pool: pgPool, // Connection pool
        createTableIfMissing: true,
        // tableName: 'user_sessions', // Use another table-name than the default "session" one
      }),
      /* process.env.NODE_ENV === 'production'
         ? new (connectPgSimple(session))({
             pool: pgPool, // Connection pool
             createTableIfMissing: true,
             // tableName: 'user_sessions', // Use another table-name than the default "session" one
           })
         : new session.MemoryStore(),*/
      cookie: {
        httpOnly: true,
        signed: true,
        sameSite: 'lax',
        // TODO: Fix secure with Okta @okta
        secure: false, // process.env.NODE_ENV === 'production',
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(/\s*,\s*/) ?? '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  // app.use('/', bullRouter);

  const options = new DocumentBuilder()
    .setTitle('@nestjsx/crud-typeorm')
    .setDescription('@nestjsx/crud-typeorm')
    .setVersion(version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // writeFile('swagger-api.json', JSON.stringify(document), 'utf8');

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      /* defaultModelsExpandDepth: 0,*/
    },
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
}
