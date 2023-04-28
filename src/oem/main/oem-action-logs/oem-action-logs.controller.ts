import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { OemActionLogsService } from './oem-action-logs.service';
import { OemActionLogEntity } from './oem-action-log.entity';

import { dto, serialize } from './oem-action-log.dto';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Crud({
  model: {
    type: OemActionLogEntity,
  },
  params: {
    actionLogId: {
      field: 'actionLogId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    limit: 50, // Default limit when it is not provided
  },
  routes: {
    only: ['getOneBase', 'getManyBase'],
  },
  dto,
  serialize,
})
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
@ApiBearerAuth('JWT-auth')
@ApiTags('Actions-Logs')
@Controller('action-logs')
export class OemActionLogsController
  implements CrudController<OemActionLogEntity>
{
  constructor(public service: OemActionLogsService) {}
}
