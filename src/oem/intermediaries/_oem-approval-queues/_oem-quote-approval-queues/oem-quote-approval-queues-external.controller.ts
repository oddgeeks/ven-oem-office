import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { OemQuoteApprovalQueue } from './oem-quote-approval-queue.entity';
import { OemQuoteApprovalQueuesService } from './oem-quote-approval-queues.service';
import { dto, serialize } from './oem-quote-approval-queue.dto';
import { SetCurrentUser } from '../../../main/oem-users/oem-users.decorators/set-current-user.decorator';
import { JWTAuthExternalGuard } from '../../../../auth/guards/jwt-auth-external.guard';

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
    only: ['getOneBase', 'updateOneBase'],
  },
  dto,
  serialize,
})
@ApiTags('Workflow Approval')
@Controller('quote-approval-queues.external')
@UseGuards(JWTAuthExternalGuard)
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
export class OemQuoteApprovalQueuesControllerExternal
  implements CrudController<OemQuoteApprovalQueue>
{
  constructor(public service: OemQuoteApprovalQueuesService) {}

  get base(): CrudController<OemQuoteApprovalQueue> {
    return this;
  }
}
