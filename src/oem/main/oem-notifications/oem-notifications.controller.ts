import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, Feature } from '@nestjsx/crud';

import { OemNotification } from './oem-notification.entity';
import { OemNotificationsService } from './oem-notifications.service';
import { dto, serialize } from './oem-notification.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';
import { IOemNotificationUpdateManyReqBody } from './oem-notification.type/oem-notification-update-many-req-body.type';

@Crud({
  model: {
    type: OemNotification,
  },
  params: {
    id: {
      field: 'notificationId',
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
      sender: {
        eager: false,
      },
      receiver: {
        eager: false,
      },
      customer: {
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
@ApiTags('Notifications')
@Controller('notifications')
@Feature('Notifications')
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
export class OemNotificationsController
  implements CrudController<OemNotification>
{
  constructor(public service: OemNotificationsService) {}

  @Post(`sendGridCallback`)
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'example@test.com',
          },
          timestamp: {
            type: 'number',
            example: 1513299569,
          },
          'smtp-id': {
            type: 'string',
            example: '<14c5d75ce93.dfd.64b469@ismtpd-555>',
          },
          event: {
            type: 'string',
            example: 'processed',
          },
          sg_event_id: {
            type: 'string',
            example: 'cHJvY2Vzc2VkLTQxNjg1OTYtak9pdDdON1lRNEtBcVNoU2Y4Sjltdy0w',
          },
          sg_message_id: {
            type: 'string',
            example:
              'jOit7N7YQ4KAqShSf8J9mw.filterdrecv-6dfbc856cf-6sz9j-1-628AFD73-4.0',
          },
        },
      },
    },
  })
  async sendGridCallback(@Body() param: any) {
    return this.service.handleSendGridCallback(param);
  }

  @Post('bulk')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bulk: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              notificationId: {
                type: 'number',
                example: 1,
              },
              isRead: {
                type: 'boolean',
                example: true,
              },
            },
          },
        },
      },
    },
  })
  async updateManyBase(@Body() param: IOemNotificationUpdateManyReqBody) {
    return this.service.updateMany(param);
  }
}
