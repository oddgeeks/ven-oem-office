import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, Feature } from '@nestjsx/crud';
import { ApiBearerAuth } from '@nestjs/swagger';

import { OemNotificationPreference } from './oem-notification-preference.entity';
import { OemNotificationPreferencesService } from './oem-notification-preferences.service';
import { dto, serialize } from './oem-notification-preference.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';

@ApiBearerAuth('JWT-auth')
@Crud({
  model: {
    type: OemNotificationPreference,
  },
  params: {
    userId: {
      field: 'userId',
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
    },
  },
  routes: {
    only: ['getOneBase', 'getManyBase', 'updateOneBase', 'replaceOneBase'],
  },
  dto,
  serialize,
})
@ApiTags('Notifications')
@Controller('notification-preferences')
@Feature('notification-preferences')
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
export class OemNotificationPreferencesController
  implements CrudController<OemNotificationPreference>
{
  constructor(public service: OemNotificationPreferencesService) {}
}
