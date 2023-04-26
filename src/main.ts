//import newrelic from 'newrelic';

import { NestFactory } from '@nestjs/core';
import { CrudConfigService } from '@nestjsx/crud';
import { enable } from 'async-local-storage';

import { setup } from './setup';
import { AppModuleConfig } from './app.module.config';
import { AppClusterService } from './app.cluster.service';
import { NewrelicInterceptor } from './common/interceptors/newrelic.interceptor';

import * as basicAuth from 'express-basic-auth';

CrudConfigService.load({
  query: {
    limit: 25,
    cache: 2000,
    alwaysPaginate: true,
  },
  routes: {
    exclude: ['createManyBase'],
    updateOneBase: {
      allowParamsOverride: true,
    },
    deleteOneBase: {
      returnDeleted: true,
    },
  },
});

async function bootstrap() {
  enable(); // enable async hooks

  const app = await NestFactory.create(AppModuleConfig);

  //app.useGlobalInterceptors(new NewrelicInterceptor());

  app.use(
    ['/docs'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  setup(app);

  await app.listen(process.env.PORT || 3000);
}

if (process.env.CLUSTERIZE == 'TRUE') {
  AppClusterService.clusterize(bootstrap);
} else {
  bootstrap();
}
