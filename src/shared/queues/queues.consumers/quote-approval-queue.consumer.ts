import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Connection, EntityManager } from 'typeorm';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';

import { OemQuoteEntity } from '../../../oem/main/oem-quotes/oem-quote.entity';
import { QuoteStatusEnum } from '../../../oem/main/oem-quotes/oem-quote.enums/quote-status.enum';
import { QuoteApprovalQueueStatusEnum } from '../../../oem/intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.enums/quote-approval-queue-status.enum';
import { OemQuoteApprovalQueuesService } from '../../../oem/intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queues.service';
import { OemQuoteApprovalQueue } from '../../../oem/intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { InjectConnection } from '@nestjs/typeorm';
import { ActionLogs } from '../../../oem/main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../../oem/main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../../oem/main/oem-action-logs/oem-action-log.enums/actions.enum';
import { QueueNames } from '../queues.enums/queue-enum';

@Processor(QueueNames.QuoteApproval)
export class QuoteApprovalQueueConsumer {
  private readonly logger = new Logger(QuoteApprovalQueueConsumer.name);

  constructor(
    @InjectConnection('MASTER_CONNECTION')
    private connection: Connection,
    private quoteApprovalQueuesService: OemQuoteApprovalQueuesService,
  ) {}

  async updateApprovalQueueExpiration(
    quoteApprovalQueues: OemQuoteApprovalQueue[],
    manager: EntityManager,
  ) {
    const validatedQuoteApprovalQueues: OemQuoteApprovalQueue[] = [];
    for (const quoteApprovalQueue of quoteApprovalQueues) {
      if (quoteApprovalQueue.status !== QuoteApprovalQueueStatusEnum.EXPIRED) {
        const now = moment.utc();
        const expiresAt =
          quoteApprovalQueue.expiresAt || now.clone().add(1, 'month').toDate();
        const isExpired = moment.utc(expiresAt).isBefore(now);

        if (isExpired) {
          quoteApprovalQueue.status = QuoteApprovalQueueStatusEnum.EXPIRED;
          await manager.save(quoteApprovalQueue);
        }
      }
    }

    return validatedQuoteApprovalQueues;
  }

  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.EXPIRE)
  async expireEvent(req, updatedVendo) {
    return updatedVendo;
  }

  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.REJECT)
  async rejectEvent(req, updatedVendo) {
    return updatedVendo;
  }

  async rejectQuoteByApprovalQueue(
    quote: OemQuoteEntity,
    manager: EntityManager,
  ) {
    const rejectedApprovalQueues = quote.quoteApprovalQueues
      .filter(
        (quoteApprovalQueue) => quoteApprovalQueue.user?.isActive !== false, // active one or customer one
      )
      .filter(
        (quoteApprovalQueue) =>
          quoteApprovalQueue.status === QuoteApprovalQueueStatusEnum.REJECTED,
      );
    if (
      quote.quoteStatus !== QuoteStatusEnum.REJECTED &&
      rejectedApprovalQueues.length > 0
    ) {
      quote.quoteStatus = QuoteStatusEnum.REJECTED;
      quote.isLocked = true;

      await manager.save(
        this.connection.manager.getRepository(OemQuoteEntity).create({
          ..._.omit(quote, 'quoteApprovalQueues'),
        }),
      );

      await this.quoteApprovalQueuesService.sendOrQueueRejectedEmail(
        quote.quoteId,
        rejectedApprovalQueues[0],
        manager,
      );

      return {
        object: {
          quoteId: rejectedApprovalQueues[0].quoteId,
        },
        user: {
          userId: rejectedApprovalQueues[0]?.user?.userId,
          companyId: rejectedApprovalQueues[0]?.companyId,
        },
        status: QuoteStatusEnum.REJECTED,
      };
    }
  }

  async updateQuoteStatus(quote: OemQuoteEntity, manager: EntityManager) {
    console.log('quoteID: ', quote.quoteId);
    // filter active quote approval queues
    const activeQuoteApprovalQueues = quote.quoteApprovalQueues.filter(
      (quoteApprovalQueue) => quoteApprovalQueue.user?.isActive !== false, // active one or customer one
    );
    await this.updateApprovalQueueExpiration(
      activeQuoteApprovalQueues,
      manager,
    );

    const resRejected = await this.rejectQuoteByApprovalQueue(quote, manager);
    if (resRejected) {
      await this.rejectEvent({ user: resRejected.user }, resRejected);
    }

    const isExpired =
      quote.expiresAt &&
      moment.utc(quote.expiresAt).isBefore(moment.utc()) &&
      quote.quoteStatus !== QuoteStatusEnum.TRANSACTED;
    if (isExpired) {
      quote.quoteStatus = QuoteStatusEnum.EXPIRED;
      quote.isLocked = true;

      await this.expireEvent(
        { user: { userId: quote.ownerUserId, companyId: quote.companyId } },
        quote,
      );

      await manager.save(
        this.connection.manager.getRepository(OemQuoteEntity).create({
          ..._.omit(quote, 'quoteApprovalQueues'),
        }),
      );

      await this.quoteApprovalQueuesService.sendOrQueueExpiredEmail(
        quote.quoteId,
        manager,
      );

      return;
    }
  }

  @Process()
  async process(job: Job) {
    await job.progress(0);

    try {
      const approvalStatuses = [
        QuoteStatusEnum.PENDING_INTERNAL_APPROVAL,
        QuoteStatusEnum.AUTO_APPROVED,
        QuoteStatusEnum.APPROVED,
        QuoteStatusEnum.SENT_EXTERNALLY,
      ];

      // get all quotes for approval or expiration
      const quotes = await this.connection.manager
        .createQueryBuilder(OemQuoteEntity, 'quote')
        .leftJoinAndSelect(
          'quote.quoteApprovalQueues',
          'quoteApprovalQueues',
          'quoteApprovalQueues.isActive = TRUE',
        )
        .leftJoinAndSelect('quoteApprovalQueues.user', 'user')
        .where(
          'quote.quoteStatus IN (:...approvalStatuses) OR (quote.quoteStatus != :expiredQuoteStatus AND quote.expiresAt IS NOT NULL AND quote.expiresAt < NOW())',
          {
            approvalStatuses,
            expiredQuoteStatus: QuoteStatusEnum.EXPIRED,
          },
        )
        .getMany();

      for (let i = 0; i < quotes.length; i++) {
        const quote = quotes[i];
        await this.connection.transaction(async (manager) => {
          await this.updateQuoteStatus(quote, manager);
          await this.quoteApprovalQueuesService.sendOrQueueApprovalEmail(
            job,
            quote,
            manager,
          );
        });

        await job.progress((((i + 1) / quotes.length) * 100).toFixed(2));
      }

      if (quotes.length === 0) await job.progress(100);

      await job.update({
        quoteIds: quotes.map((quote) => quote.quoteId),
      });
    } catch (error) {
      this.logger.error({
        func: 'QuoteApprovalQueueConsumer/process',
        error,
      });
      console.log(error);

      throw error;
    }

    await job.progress(100);
  }
}
