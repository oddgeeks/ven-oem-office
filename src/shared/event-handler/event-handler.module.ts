import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Connection } from 'typeorm';
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from '@nestjs/typeorm';

import { CommandHandlers } from './event.commands/handler';
import { EventHandlerService } from './event-handler.service';
import { QueuesModule } from '../queues/queues.module';
import { OemNotification } from '../../oem/main/oem-notifications/oem-notification.entity';

@Module({
  imports: [
    CqrsModule,
    QueuesModule,
    TypeOrmModule.forFeature([OemNotification], 'MASTER_CONNECTION'),
    TypeOrmModule.forFeature([OemNotification]),
  ],
  controllers: [],
  providers: [
    ...CommandHandlers,
    EventHandlerService,
    {
      provide: getRepositoryToken(OemNotification),
      useFactory: (connection: Connection) =>
        connection.getRepository(OemNotification),
      inject: [getDataSourceToken('MASTER_CONNECTION')],
    },
  ],
  exports: [],
})
export class EventHandlerModule {}
