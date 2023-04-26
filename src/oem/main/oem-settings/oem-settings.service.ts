import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { useSeeding, runSeeder } from 'typeorm-seeding';

import { getSeedConnectionUtil } from '../../../utils/get-seed-connection.util';
import { clearDB } from '../../../utils/clear-db.util';
import { resetDBMeta } from '../../../utils/reset-db-meta.util';
import CreateOemClean from '../../seeds/clean/index.seed';
import CreateOemDemo from '../../seeds/demo/index.seed';
import { QueuesService } from '../../../shared/queues/queues.service';
import { SetCurrentTenant } from '../../../common/decorators/set-current-tenant.decorator';

@Injectable()
@SetCurrentTenant
export class OemSettingsService {
  private readonly logger = new Logger(OemSettingsService.name);

  constructor(private queuesService: QueuesService) {}

  async seedCleanDemo({
    companyId = 1,
    companyName,
    subdomain,
  }: {
    companyId: number | null;
    companyName: string;
    subdomain: string;
  }) {
    try {
      await getSeedConnectionUtil();

      await useSeeding();

      await runSeeder(
        CreateOemClean({
          companyId,
          companyName,
          subdomain,
        }),
      );
    } catch (err) {
      this.logger.error({
        func: 'settings/seedCleanDemo',
        err: err?.message || err,
      });

      // clear database to prevent zombie records
      // await clearDB();

      throw err;
    }
  }

  async seedDemo({
    companyId = 1,
    companyName,
    subdomain,
  }: {
    companyId: number | null;
    companyName: string;
    subdomain: string;
  }) {
    try {
      await getSeedConnectionUtil();

      await useSeeding();

      await runSeeder(
        CreateOemDemo({
          companyId,
          companyName,
          subdomain,
        }),
      );
    } catch (err) {
      this.logger.error({
        func: 'settings/seedDemo',
        err: err?.message || err,
      });

      // clear database to prevent zombie records
      // await clearDB();

      throw err;
    }
  }

  async resetEnv(req: Request) {
    // TODO: this task takes some time so might have timeout error on frontend
    // we need to replace it with some subscription system using graphql or websocket later

    const host = req['headers'].host || '';
    const subdomain: string = host
      .split('.')[0]
      .toString()
      .replace(/http(s|)\:\/\//, '')
      .replace('undefined', '')
      .replace(/\:\d{1,4}/, '');

    const env = process.env.NODE_ENV;

    this.logger.log({
      func: 'settings/resetEnv',
      subdomain,
      env,
      user: req['user'],
    });

    // pause all queues to prevent dead lock while truncating tables
    await this.queuesService.pauseAllQueues();

    await clearDB();

    if (subdomain === 'api-demo-oem' && env === 'demo') {
      // demo
      await this.seedDemo({
        companyId: 1,
        companyName: 'Demo & Co.',
        subdomain: 'demo',
      });

      await this.seedCleanDemo({
        companyId: 2,
        companyName: 'clean',
        subdomain: 'clean',
      });
    } else if (subdomain === 'api-staging-oem' && env === 'staging') {
      // staging
      await this.seedDemo({
        companyId: 1,
        companyName: 'Staging',
        subdomain: 'staging',
      });

      await this.seedDemo({
        companyId: 2,
        companyName: 'Staging1',
        subdomain: 'staging1',
      });

      await this.seedCleanDemo({
        companyId: 3,
        companyName: 'Vercel',
        subdomain: 'vendori-admin',
      });
    } else if (subdomain === 'api-mock-oem' && env === 'mock') {
      // to test locally
      await this.seedDemo({
        companyId: 1,
        companyName: 'mock',
        subdomain: 'mock',
      });

      // staging
      await this.seedCleanDemo({
        companyId: 2,
        companyName: 'Mock1',
        subdomain: 'mock1',
      });
    } else if (subdomain === 'localhost' && env === 'development') {
      // to test locally
      await this.seedDemo({
        companyId: 1,
        companyName: 'Localhost',
        subdomain: 'localhost',
      });

      // staging
      await this.seedCleanDemo({
        companyId: 2,
        companyName: 'Localhost1',
        subdomain: 'localhost1',
      });
    } else if (env === 'production') {
      // production
    }

    // For some reason after resetting the data we are getting the foreign key constraint vilolation error without this
    await resetDBMeta();

    await this.queuesService.resumeAllQueues();
  }
}
