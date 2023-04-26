import {
  Controller,
  UseGuards,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { SessionAuthGuard } from '../../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { AuthUser } from '../oem-users/oem-users.decorators/auth-user.decorator';
import { OemSupportsService } from './oem-supports.service';
import { SupportEmailDto } from './oem-supports.dto/oem-support-email.dto';
import { FeedbackTypeEnum } from './oem-supports.enums/feedback-type.enum';
import { OemUserEntity } from '../oem-users/oem-user.entity';

@ApiBearerAuth('JWT-auth')
@ApiTags('Supports')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@Controller('supports')
export class OemSupportsController {
  constructor(public service: OemSupportsService) {}

  @Post('support-email')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    description: 'Send Support Email',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        feedbackType: {
          type: 'string',
          enum: [
            FeedbackTypeEnum.ProductFeedback,
            FeedbackTypeEnum.TechnicalSupport,
          ],
          default: FeedbackTypeEnum.ProductFeedback,
        },
        message: {
          type: 'string',
          default: 'Help Me',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  sendSupportEmail(
    @AuthUser() user: OemUserEntity,
    @Body() body: SupportEmailDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.sendSupportEmail(user, body, file);
  }
}
