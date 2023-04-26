import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { OemCompanyProgram } from './oem-company-program.entity';
import { OemCompanyProgramsService } from './oem-company-programs.service';
import { dto, serialize } from './oem-company-program.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../../main/oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemCompanyProgram,
  },
  params: {
    id: {
      field: 'companyProgramId',
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
      channel: {
        eager: false,
      },
      companyChannel: {
        eager: false,
      },
    },
  },
  routes: {
    only: ['getOneBase', 'getManyBase'],
  },
  dto,
  serialize,
})
@ApiTags('Channels')
@Controller('company-programs')
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
export class OemCompanyProgramsController
  implements CrudController<OemCompanyProgram>
{
  constructor(public service: OemCompanyProgramsService) {}
}
