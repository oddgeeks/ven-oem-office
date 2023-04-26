import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, Feature } from '@nestjsx/crud';
import { OemCompanyEntity } from './oem-company.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

import { OemCompaniesService } from './oem-companies.service';
import { dto, serialize } from './oem-company.dto';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';

@ApiBearerAuth('JWT-auth')
@Crud({
  model: {
    type: OemCompanyEntity,
  },
  params: {
    id: {
      field: 'companyId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      companyAddress: {
        eager: false,
      },
      'companyAddress.address': {
        eager: false,
        alias: 'address',
      },
    },
  },
  routes: {
    only: ['getOneBase', 'updateOneBase', 'createOneBase'],
  },
  dto,
  serialize,
})
@ApiTags('Company')
@Controller('companies')
@Feature('Companies')
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
export class OemCompaniesController
  implements CrudController<OemCompanyEntity>
{
  constructor(public service: OemCompaniesService) {}
}
