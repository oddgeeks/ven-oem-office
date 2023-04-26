import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApprovalQueuePriority } from './oem-approval-queue-priority.entity';
import { OemApprovalQeuePrioritiesService } from './oem-approval-queue-priorities.service';
import { OemApprovalQeuePrioritiesController } from './oem-approval-queue-priorities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalQueuePriority])],
  providers: [OemApprovalQeuePrioritiesService],
  exports: [OemApprovalQeuePrioritiesService],
  controllers: [OemApprovalQeuePrioritiesController],
})
export class OemApprovalQeuePrioritiesModule {}
