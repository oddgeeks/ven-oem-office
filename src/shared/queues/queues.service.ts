import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import Redis from 'ioredis';
import { Logger } from '@nestjs/common';

import * as config from '../../environments';
import { JobNames, QueueNames } from './queues.enums/queue-enum';

@Injectable()
export class QueuesService implements OnModuleInit {
  private readonly logger = new Logger(QueuesService.name);

  constructor(
    @InjectQueue(QueueNames.QuoteApproval)
    private quoteApprovalQueue: Queue,
    @InjectQueue(QueueNames.VendoApproval)
    private vendoApprovalQueue: Queue,
    @InjectQueue(QueueNames.BatchedEmail)
    private batchedEmailQueue: Queue,
    @InjectQueue(QueueNames.SyncSalesForce)
    private syncSalesforceQueue: Queue,
    @InjectQueue(QueueNames.PdfExport)
    private pdfExportQueue: Queue,
  ) {}

  async onModuleInit() {
    const redis = new Redis(config.redis);
    redis.ping(async (err) => {
      if (err) {
        this.logger.error({
          func: 'QueuesService/onModuleInit',
          err,
        });

        return;
      }

      if (config.NODE_ENV === 'test') {
        return;
      }

      // this.quoteApprovalQueue.add(
      //   {},
      //   {
      //     // every minute
      //     repeat: { every: 60000 },

      //     // keep the history for a week
      //     removeOnComplete: config.BULL_HISTORY_TTL_HOURS * 60,
      //     removeOnFail: config.BULL_HISTORY_TTL_HOURS * 60,
      //   },
      // );

      // this.vendoApprovalQueue.add(
      //   {},
      //   {
      //     // every minute
      //     repeat: { every: 60000 },

      //     // keep the history for a week
      //     removeOnComplete: config.BULL_HISTORY_TTL_HOURS * 60,
      //     removeOnFail: config.BULL_HISTORY_TTL_HOURS * 60,
      //   },
      // );

      // this.batchedEmailQueue.add(
      //   {},
      //   {
      //     // every minute
      //     repeat: { every: 60000 },

      //     // keep the history for a week
      //     removeOnComplete: config.BULL_HISTORY_TTL_HOURS * 60,
      //     removeOnFail: config.BULL_HISTORY_TTL_HOURS * 60,
      //   },
      // );

      // this.syncSalesforceQueue.add(JobNames.BatchSyncQuotesToSF, null, {
      //   // 0 0 0 * * *: every midnight
      //   repeat: { cron: '0 0 0 * * *' },
      //   // delay: 5000,

      //   removeOnFail: 7,
      //   removeOnComplete: 7,
      // });

      this.logger.log(`QueuesService HealthCheck is OK on ${new Date()}`);
    });
  }

  async addPdfExportQueue({
    quoteId,
    vendoId,
  }: {
    quoteId?: number;
    vendoId?: number;
  }) {
    return this.pdfExportQueue.add(
      {
        quoteId,
        vendoId,
      },
      {
        // keep the history for the latest 1000 records
        removeOnComplete: 1000,
        removeOnFail: 1000,
      },
    );
  }

  async addRealtimeSyncToSF(
    jobName: JobNames,
    id: number,
    payload?: any,
    deleted = false,
  ) {
    await this.syncSalesforceQueue.add(
      jobName,
      {
        id,
        payload,
        deleted,
      },
      { priority: 1 },
    );
  }

  async pauseAllQueues() {
    await this.quoteApprovalQueue.pause();
    await this.vendoApprovalQueue.pause();
    await this.batchedEmailQueue.pause();
    await this.pdfExportQueue.pause();
    await this.syncSalesforceQueue.pause();
  }

  async resumeAllQueues() {
    await this.quoteApprovalQueue.resume();
    await this.vendoApprovalQueue.resume();
    await this.batchedEmailQueue.resume();
    await this.pdfExportQueue.resume();
    await this.syncSalesforceQueue.resume();
  }
}
