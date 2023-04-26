import { Module } from '@nestjs/common';
import { OemSupportsService } from './oem-supports.service';
import { OemSupportsController } from './oem-supports.controller';
import { OemNotificationsModule } from '../oem-notifications/oem-notifications.module';

@Module({
  imports: [OemNotificationsModule],
  providers: [OemSupportsService],
  exports: [OemSupportsService],
  controllers: [OemSupportsController],
})
export class OemSupportsModule {}
