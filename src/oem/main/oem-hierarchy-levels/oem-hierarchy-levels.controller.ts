import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { dto, serialize } from './oem-hierarchy-level.dto';
import { AuthGuard } from '@nestjs/passport';
import { OemHierarchyLevelEntity } from './oem-hierarchy-level.entity';
import { OemHierarchyLevelsService } from './oem-hierarchy-levels.service';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';

@Crud({
  model: {
    type: OemHierarchyLevelEntity,
  },
  params: {
    id: {
      field: 'hierarchyLevelId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      hierarchies: {
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
@ApiTags('Company')
@Controller('hierarchy-levels')
export class OemHierarchyLevelsController
  implements CrudController<OemHierarchyLevelEntity>
{
  constructor(public service: OemHierarchyLevelsService) {}
}
