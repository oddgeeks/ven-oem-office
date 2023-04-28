import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Connection } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';

import { OemNotification } from './oem-notification.entity';
import { OemNotificationCreateDto } from './oem-notification.dto/oem-notification.create.dto';
import { IOemNotificationUpdateManyReqBody } from './oem-notification.type/oem-notification-update-many-req-body.type';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { FilterCurrentUser } from '../../../common/decorators/fiter-current-user.decorator';

@Injectable()
@CommonDefaultMethodExtension
export class OemNotificationsService extends TypeOrmCrudService<OemNotification> {
  private readonly logger = new Logger(OemNotificationsService.name);

  constructor(
    @InjectRepository(OemNotification) repo: Repository<OemNotification>,
    private connection: Connection,
  ) {
    super(repo);
  }

  async handleSendGridCallback(reqBody: any) {
    this.logger.log({
      func: 'OemNotificationsService/handleSendGridCallback',
      reqBody,
      message: 'Handle SendGrid Callback',
    });

    // https://docs.sendgrid.com/for-developers/tracking-events/event#events
    for (const event of reqBody) {
      const { email, event: status, sg_message_id: messageId } = event;

      if (!email || !messageId) {
        continue;
      }

      const updateAttrs: any = {
        status,
        reqBody,
      };

      await this.repo.update(updateAttrs, {
        toEmail: email,
        messageId,
      });
    }
  }

  async create(dto: Partial<OemNotificationCreateDto>, manager: EntityManager) {
    return manager.save(this.repo.create(dto));
  }

  async updateMany(reqBody: IOemNotificationUpdateManyReqBody) {
    return this.repo.manager.transaction(async (manager) => {
      const updatedNotifications: OemNotification[] = [];

      //TODO(performance issue!): this is really a bad solution when we try to get a bulk via single findOne, also we should save it via a bulk update method
      for (const payload of reqBody.bulk) {
        const { notificationId, isRead } = payload;

        const notification = await this.repo.findOne(payload.notificationId);
        if (!notification) {
          throw new NotFoundException(
            `Notification not found with ID - ${notificationId}`,
          );
        }

        notification.isRead = isRead;
        await manager.save(OemNotification, notification);

        updatedNotifications.push(notification);
      }

      return updatedNotifications;
    });
  }

  @FilterCurrentUser('receiverId')
  async getMany(req: CrudRequest) {
    return super.getMany(req);
  }
}
