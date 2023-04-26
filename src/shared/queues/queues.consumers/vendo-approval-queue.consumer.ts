import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Connection, EntityManager } from 'typeorm';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';

import { OemVendoEntity } from '../../../oem/main/oem-vendos/oem-vendo.entity';
import { VendoStatusEnum } from '../../../oem/main/oem-vendos/oem-vendo.enums/vendo-status.enum';
import { VendoApprovalQueueStatusEnum } from '../../../oem/intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.enums/vendo-approval-queue-status.enum';
import { OemVendoApprovalQueuesService } from '../../../oem/intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queues.service';
import { OemVendoApprovalQueue } from '../../../oem/intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';
import { InjectConnection } from '@nestjs/typeorm';
import { ActionLogs } from '../../../oem/main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../../oem/main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../../oem/main/oem-action-logs/oem-action-log.enums/actions.enum';
import { QueueNames } from '../queues.enums/queue-enum';

@Processor(QueueNames.VendoApproval)
export class VendoApprovalQueueConsumer {
  private readonly logger = new Logger(VendoApprovalQueueConsumer.name);

  constructor(
    @InjectConnection('MASTER_CONNECTION')
    private connection: Connection,
    private vendoApprovalQueuesService: OemVendoApprovalQueuesService,
  ) {}

  async updateApprovalQueueExpiration(
    vendoApprovalQueues: OemVendoApprovalQueue[],
    manager: EntityManager,
  ) {
    const validatedVendoApprovalQueues: OemVendoApprovalQueue[] = [];

    for (const vendoApprovalQueue of vendoApprovalQueues) {
      if (vendoApprovalQueue.status !== VendoApprovalQueueStatusEnum.EXPIRED) {
        const now = moment.utc();
        const expiresAt =
          vendoApprovalQueue.expiresAt || now.clone().add(1, 'month').toDate();
        const isExpired = moment.utc(expiresAt).isBefore(now);

        if (isExpired) {
          vendoApprovalQueue.status = VendoApprovalQueueStatusEnum.EXPIRED;
          await manager.save(vendoApprovalQueue);
        }
      }
    }

    return validatedVendoApprovalQueues;
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.EXPIRE)
  async expireEvent(req, updatedVendo) {
    return updatedVendo;
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.REJECT)
  async rejectEvent(req, updatedVendo) {
    return updatedVendo;
  }

  async rejectVendoByApprovalQueues(
    vendo: OemVendoEntity,
    manager: EntityManager,
  ) {
    const rejectedApprovalQueues = vendo.vendoApprovalQueues
      .filter(
        (vendoApprovalQueue) => vendoApprovalQueue.user?.isActive !== false, // active one or customer one
      )
      .filter(
        (vendoApprovalQueue) =>
          vendoApprovalQueue.status === VendoApprovalQueueStatusEnum.REJECTED,
      );
    if (
      vendo.vendoStatus !== VendoStatusEnum.REJECTED &&
      rejectedApprovalQueues.length > 0
    ) {
      vendo.vendoStatus = VendoStatusEnum.REJECTED;
      vendo.isLocked = true;

      await manager.save(
        this.connection.manager.getRepository(OemVendoEntity).create({
          ..._.omit(vendo, 'vendoApprovalQueues'),
        }),
      );
      await this.vendoApprovalQueuesService.sendOrQueueRejectedEmail(
        vendo.vendoId,
        rejectedApprovalQueues[0],
        manager,
      );

      return {
        id: rejectedApprovalQueues[0].vendoId,
        user: {
          userId: rejectedApprovalQueues[0]?.user?.userId,
          companyId: rejectedApprovalQueues[0]?.companyId,
        },
        status: VendoStatusEnum.REJECTED,
      };
    }
  }

  async updateVendoStatus(vendo: OemVendoEntity, manager: EntityManager) {
    // filter active vendo approval queues
    const activeVendoApprovalQueues = vendo.vendoApprovalQueues.filter(
      (vendoApprovalQueue) => vendoApprovalQueue.user?.isActive !== false, // active one or customer one
    );

    await this.updateApprovalQueueExpiration(
      activeVendoApprovalQueues,
      manager,
    );

    const resRejected = await this.rejectVendoByApprovalQueues(vendo, manager);
    if (resRejected) {
      await this.rejectEvent({ user: resRejected.user }, resRejected);
      return resRejected;
    }
    const isExpired =
      vendo.expiresAt &&
      moment.utc(vendo.expiresAt).isBefore(moment.utc()) &&
      vendo.vendoStatus !== VendoStatusEnum.TRANSACTED;
    if (isExpired) {
      vendo.vendoStatus = VendoStatusEnum.EXPIRED;
      vendo.isLocked = true;
      await this.expireEvent(
        { user: { userId: vendo.ownerUserId, companyId: vendo.companyId } },
        vendo,
      );

      await manager.save(
        this.connection.manager.getRepository(OemVendoEntity).create({
          ..._.omit(vendo, 'vendoApprovalQueues'),
        }),
      );

      await this.vendoApprovalQueuesService.sendOrQueueExpiredEmail(
        vendo.vendoId,
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
        VendoStatusEnum.PENDING_INTERNAL_APPROVAL,
        VendoStatusEnum.AUTO_APPROVED,
        VendoStatusEnum.APPROVED,
        VendoStatusEnum.SENT_EXTERNALLY,
      ];

      // get all vendos for approval or expiration
      const vendos = await this.connection.manager
        .createQueryBuilder(OemVendoEntity, 'vendo')
        .leftJoinAndSelect(
          'vendo.vendoApprovalQueues',
          'vendoApprovalQueues',
          'vendoApprovalQueues.isActive = TRUE',
        )
        .leftJoinAndSelect('vendoApprovalQueues.user', 'user')
        .where(
          'vendo.vendoStatus IN (:...approvalStatuses) OR (vendo.vendoStatus != :expiredVendoStatus AND vendo.expiresAt IS NOT NULL AND vendo.expiresAt < NOW())',
          {
            approvalStatuses,
            expiredVendoStatus: VendoStatusEnum.EXPIRED,
          },
        )
        .getMany();

      for (let i = 0; i < vendos.length; i++) {
        const vendo = vendos[i];

        await this.connection.transaction(async (manager) => {
          await this.updateVendoStatus(vendo, manager);
          await this.vendoApprovalQueuesService.sendOrQueueApprovalEmail(
            vendo,
            manager,
          );
        });

        await job.progress((((i + 1) / vendos.length) * 100).toFixed(2));
      }

      await job.update({
        vendoIds: vendos.map((vendo) => vendo.vendoId),
      });
    } catch (err) {
      this.logger.error({
        func: 'VendoApprovalQueueConsumer/process',
        err,
      });

      throw err;
    }

    await job.progress(100);
  }
}
