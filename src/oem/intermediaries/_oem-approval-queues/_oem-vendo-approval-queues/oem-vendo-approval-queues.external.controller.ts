import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, Override } from '@nestjsx/crud';

import { OemVendoApprovalQueue } from './oem-vendo-approval-queue.entity';
import { OemVendoApprovalQueuesService } from './oem-vendo-approval-queues.service';
import { dto, serialize } from './oem-vendo-approval-queue.dto';
import { SessionAuthGuard } from '../../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { InjectSubHierarchyInterceptor } from '../../../../common/interceptors/inject-sub-hierarchy.interceptor';
import { SetCurrentUser } from '../../../main/oem-users/oem-users.decorators/set-current-user.decorator';
import { OemQuoteApprovalQueue } from '../_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { JWTAuthExternalGuard } from '../../../../auth/guards/jwt-auth-external.guard';

@Crud({
  model: {
    type: OemVendoApprovalQueue,
  },
  params: {
    id: {
      field: 'vendoApprovalQueueId',
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
      vendo: {
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
@Controller('vendo-approval-queues.external')
@UseGuards(JWTAuthExternalGuard)
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
export class OemVendoApprovalQueuesControllerExternal
  implements CrudController<OemVendoApprovalQueue>
{
  constructor(public service: OemVendoApprovalQueuesService) {}

  get base(): CrudController<OemVendoApprovalQueue> {
    return this;
  }
}
