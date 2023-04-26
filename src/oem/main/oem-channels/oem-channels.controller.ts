import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

import { OemChannelEntity } from './oem-channel.entity';
import { OemChannelsService } from './oem-channels.service';
import { dto, serialize } from './oem-channel.dto';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SetCurrentUser } from '../oem-users/oem-users.decorators/set-current-user.decorator';
import { AuthUser } from '../oem-users/oem-users.decorators/auth-user.decorator';
import { OemChannelRequestDto } from './oem-channel.dto/oem-channel.request.dto';

@Crud({
  model: {
    type: OemChannelEntity,
  },
  params: {
    id: {
      field: 'channelId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      companyPrograms: {
        eager: false,
      },
      companyChannels: {
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
@Controller('channels')
@ApiBearerAuth('JWT-auth')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@CrudAuth({
  filter: () => ({
    isEnabled: true,
  }),
  persist: () => ({
    isEnabled: true,
  }),
})
@SetCurrentUser
export class OemChannelsController implements CrudController<OemChannelEntity> {
  constructor(public service: OemChannelsService) {}

  @Post(`request-channel`)
  async requestChannel(
    @AuthUser() user: any,
    @Body() body: OemChannelRequestDto,
  ) {
    return this.service.requestChannel(user, body);
  }
}
