import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { AuthGuard } from '@nestjs/passport';

import { OemLicensingProgramsService } from './oem-licensing-programs.service';
import { OemLicensingProgramEntity } from './oem-licensing-program.entity';
import { dto, serialize } from './oem-licensing-program.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemLicensingProgramEntity,
  },
  params: {
    id: {
      field: 'licensingProgramId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      companyChannel: {
        eager: false,
      },
    },
  },
  routes: {
    exclude: ['createManyBase'],
  },
  dto,
  serialize,
})
@ApiTags('Company')
@Controller('licensing-programs')
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
export class OemLicensingProgramsController
  implements CrudController<OemLicensingProgramEntity>
{
  constructor(public service: OemLicensingProgramsService) {}
}
