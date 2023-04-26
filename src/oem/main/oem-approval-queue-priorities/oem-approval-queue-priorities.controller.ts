import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { ApprovalQueuePriority } from './oem-approval-queue-priority.entity';
import { OemApprovalQeuePrioritiesService } from './oem-approval-queue-priorities.service';
import { dto, serialize } from './oem-approval-queue-priority.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: ApprovalQueuePriority,
  },
  params: {
    id: {
      field: 'approvalQueuePriorityId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      company: {
        eager: false,
      },
      role: {
        eager: false,
      },
    },
  },
  routes: {
    only: ['getOneBase', 'getManyBase', 'updateOneBase'],
  },
  dto,
  serialize,
})
@ApiTags('Workflow Approval')
@Controller('approval-queue-priorities')
@ApiBearerAuth('JWT-auth')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@CrudAuth({
  filter: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
  persist: (req) => ({
    companyId: req.user.companyId,
    isEnabled: true,
  }),
})
@SetCurrentUser
export class OemApprovalQeuePrioritiesController
  implements CrudController<ApprovalQueuePriority>
{
  constructor(public service: OemApprovalQeuePrioritiesService) {}
}
