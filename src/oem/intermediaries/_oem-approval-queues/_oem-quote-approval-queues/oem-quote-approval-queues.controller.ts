import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, Feature } from '@nestjsx/crud';

import { OemQuoteApprovalQueue } from './oem-quote-approval-queue.entity';
import { OemQuoteApprovalQueuesService } from './oem-quote-approval-queues.service';
import { dto, serialize } from './oem-quote-approval-queue.dto';
import { SessionAuthGuard } from '../../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../../main/oem-users/oem-users.decorators/set-current-user.decorator';
import { RolesGuard } from '../../../../auth/roles/guards/roles.guard';
import { RoleSubjects } from '../../../../auth/roles/types/role-subjects.type';

@Crud({
  model: {
    type: OemQuoteApprovalQueue,
  },
  params: {
    id: {
      field: 'quoteApprovalQueueId',
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
      user: {
        eager: false,
      },
      quote: {
        eager: false,
      },
      approvalQueuePriority: {
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
@Controller('quote-approval-queues')
@Feature(RoleSubjects.QuoteApprovalQueue)
@UseGuards(SessionAuthGuard, JWTAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
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
export class OemQuoteApprovalQueuesController
  implements CrudController<OemQuoteApprovalQueue>
{
  constructor(public service: OemQuoteApprovalQueuesService) {}
}
