import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OemActionLogEntity } from './oem-action-log.entity';
import { OemActionLogsService } from './oem-action-logs.service';
import { OemActionLogsController } from './oem-action-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OemActionLogEntity])],
  providers: [OemActionLogsService],
  exports: [OemActionLogsService],
  controllers: [OemActionLogsController],
})
export class OemActionLogsModule {}
