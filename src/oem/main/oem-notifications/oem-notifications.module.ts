import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemNotification } from './oem-notification.entity';
import { OemNotificationsService } from './oem-notifications.service';
import { OemNotificationsController } from './oem-notifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemNotification])],
  providers: [OemNotificationsService],
  exports: [OemNotificationsService],
  controllers: [OemNotificationsController],
})
export class OemNotificationsModule {}
