import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Inject, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { REQUEST } from '@nestjs/core';

@ApiBearerAuth('JWT-auth')
@ApiTags('ThirdPartyToken')
@Controller('token-auth')
export class OemUsersController {
  constructor(@Inject(REQUEST) private request) {}

  get base() {
    return this;
  }
}
