import { Controller, UseGuards, Post, Request } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { OemSettingsService } from './oem-settings.service';

@ApiBearerAuth('JWT-auth')
@ApiTags('Settings')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@Controller('settings')
export class OemSettingsController {
  constructor(public service: OemSettingsService) {}

  @Post(`reset-env`)
  @ApiOperation({
    description: 'Reset Environment',
  })
  resetEnv(@Request() req: any) {
    return this.service.resetEnv(req);
  }
}
