import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemNotificationPreference } from './oem-notification-preference.entity';
import { OemNotificationPreferencesService } from './oem-notification-preferences.service';
import { OemNotificationPreferencesController } from './oem-notification-preferences.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemNotificationPreference])],
  providers: [OemNotificationPreferencesService],
  exports: [OemNotificationPreferencesService],
  controllers: [OemNotificationPreferencesController],
})
export class OemNotificationPreferencesModule {}
