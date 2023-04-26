import { Module } from '@nestjs/common';

import { OemSettingsService } from './oem-settings.service';
import { OemSettingsController } from './oem-settings.controller';
import { QueuesModule } from '../../../shared/queues/queues.module';

@Module({
  imports: [QueuesModule],
  providers: [OemSettingsService],
  exports: [OemSettingsService],
  controllers: [OemSettingsController],
})
export class OemSettingsModule {}
