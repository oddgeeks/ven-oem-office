import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'typeorm';

import {
  MAIL_USER_INVITE_TEMPLATE_ID,
  VENDORI_COMPANY_ADDRESS,
  VENDORI_SUPPORT_EMAIL,
  VENDORI_INTERNAL_SUPPORT_EMAIL,
  VENDORI_LOGO_URL,
} from '../../../environments';
import { SupportEmailDto } from './oem-supports.dto/oem-support-email.dto';
import { OemUserEntity } from '../oem-users/oem-user.entity';
import { sendGridEmailWithDynamicTemplate } from '../../../shared/email';
import {
  EmailDynamicTemplate,
  EmailMessage,
} from '../../../shared/email/email.type';
import { OemNotificationsService } from '../oem-notifications/oem-notifications.service';
import { OemNotificationTypeEnum } from '../oem-notifications/oem-notification.enums/oem-notification.notification-type.enum';
import { SetCurrentTenant } from '../../../common/decorators/set-current-tenant.decorator';

@Injectable()
@SetCurrentTenant
export class OemSupportsService {
  private readonly logger = new Logger(OemSupportsService.name);
  constructor(
    private connection: Connection,
    private notificationsService: OemNotificationsService,
  ) {}

  async sendSupportEmail(
    user: OemUserEntity,
    body: SupportEmailDto,
    file: Express.Multer.File,
  ) {
    const subject = `${user.firstName} ${user.lastName} requested feedback in the ${body.feedbackType} category`;
    const email = VENDORI_INTERNAL_SUPPORT_EMAIL;

    const dynamicTemplateData: EmailDynamicTemplate = {
      logoURL: VENDORI_LOGO_URL,
      subject,
      body: body.message?.replace(/\s+/g, ' '),
      companyAddress: VENDORI_COMPANY_ADDRESS,
      showButton: false,
    };

    const emailMessage: EmailMessage = {
      subject,
      from: {
        name: 'Vendori',
        email: VENDORI_SUPPORT_EMAIL,
      },
      to: [
        {
          name: 'Vendori',
          email,
        },
      ],
      templateId: MAIL_USER_INVITE_TEMPLATE_ID,
      dynamicTemplateData,
    };

    if (file?.buffer) {
      const fileType = file.mimetype?.split('/')[1];
      const filename = fileType ? `attachment.${fileType}` : 'attachment';

      emailMessage.attachment = {
        content: file.buffer.toString('base64'),
        filename,
        type: file.mimetype,
      };
    }

    const result = await sendGridEmailWithDynamicTemplate(emailMessage);
    const messageId = result[0].headers['x-message-id'];

    await this.notificationsService.create(
      {
        companyId: user.companyId,
        senderId: user.userId,
        fromEmail: VENDORI_SUPPORT_EMAIL,
        toEmail: email,
        messageId,
        metaData: emailMessage,
        notificationType: OemNotificationTypeEnum.USER_INVITE,
        status: 'requested',
        sentAt: new Date(),
        subject,
      },
      this.connection.manager,
    );

    this.logger.log({
      func: 'OemSupportsService/sendSupportEmail',
      body,
      emailMessage,
      result,
      message: 'After requesting a channel',
    });
  }
}
