import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, Feature } from '@nestjsx/crud';

import { OemVendoApprovalQueue } from './oem-vendo-approval-queue.entity';
import { OemVendoApprovalQueuesService } from './oem-vendo-approval-queues.service';
import { dto, serialize } from './oem-vendo-approval-queue.dto';
import { SessionAuthGuard } from '../../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../../main/oem-users/oem-users.decorators/set-current-user.decorator';
import { RolesGuard } from '../../../../auth/roles/guards/roles.guard';
import { RoleSubjects } from '../../../../auth/roles/types/role-subjects.type';

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
    only: ['getOneBase', 'getManyBase', 'updateOneBase'],
  },
  dto,
  serialize,
})
@ApiTags('Workflow Approval')
@Controller('vendo-approval-queues')
@Feature(RoleSubjects.VendoApprovalQueue)
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
export class OemVendoApprovalQueuesController
  implements CrudController<OemVendoApprovalQueue>
{
  constructor(public service: OemVendoApprovalQueuesService) {}
}
