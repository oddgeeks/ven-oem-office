import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { SessionLogoutEventHandlerCommand } from '../impl/session-logout-event-handler.command';
import { OemNotification } from '../../../../oem/main/oem-notifications/oem-notification.entity';
import { Repository } from 'typeorm';

@CommandHandler(SessionLogoutEventHandlerCommand)
export class SessionLogoutEventHandler
  implements ICommandHandler<SessionLogoutEventHandlerCommand>
{
  constructor(
    @InjectRepository(OemNotification)
    private notificationRepo: Repository<OemNotification>,
  ) {}

  private async _markNotificationsAsRead(receiverId: number) {
    await this.notificationRepo.update(
      {
        receiverId,
        isEnabled: true,
      },
      {
        isRead: true,
      },
    );
  }

  async execute(command: SessionLogoutEventHandlerCommand) {
    const { userId } = command;
    if (userId) {
      await this._markNotificationsAsRead(userId);
    }
  }
}
