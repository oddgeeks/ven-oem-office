import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemChannelEntity } from './oem-channel.entity';
import { OemChannelsService } from './oem-channels.service';
import { OemChannelsController } from './oem-channels.controller';
import { OemNotificationsModule } from '../oem-notifications/oem-notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OemChannelEntity]),
    OemNotificationsModule,
  ],
  providers: [OemChannelsService],
  exports: [OemChannelsService],
  controllers: [OemChannelsController],
})
export class OemChannelsModule {}
