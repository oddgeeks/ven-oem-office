import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { OemChannelEntity } from './oem-channel.entity';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import {
  MAIL_USER_INVITE_TEMPLATE_ID,
  VENDORI_COMPANY_ADDRESS,
  VENDORI_INTERNAL_RECEPTION_EMAIL,
  VENDORI_LOGO_URL,
  VENDORI_SUPPORT_EMAIL,
} from '../../../environments';
import {
  EmailDynamicTemplate,
  EmailMessage,
} from '../../../shared/email/email.type';
import { sendGridEmailWithDynamicTemplate } from '../../../shared/email';
import { OemNotificationTypeEnum } from '../oem-notifications/oem-notification.enums/oem-notification.notification-type.enum';
import { OemChannelRequestDto } from './oem-channel.dto/oem-channel.request.dto';
import { OemNotificationsService } from '../oem-notifications/oem-notifications.service';

@Injectable()
@CommonDefaultMethodExtension
export class OemChannelsService extends TypeOrmCrudService<OemChannelEntity> {
  private readonly logger = new Logger(OemChannelsService.name);

  constructor(
    @InjectRepository(OemChannelEntity)
    public repo: Repository<OemChannelEntity>,
    private notificationsService: OemNotificationsService,
  ) {
    super(repo);
  }

  async requestChannel(user: any, body: OemChannelRequestDto) {
    const subject = `${user.firstName} ${user.lastName} would like a new channel added`;
    const email = VENDORI_INTERNAL_RECEPTION_EMAIL;

    const dynamicTemplateData: EmailDynamicTemplate = {
      logoURL: VENDORI_LOGO_URL,
      subject,
      body: `
        Channel Requested: <br/><br/> <strong> ${body.partnerName} <br/> ${body.website} <br/> ${body.contactEmail} </strong>
      `.replace(/\s+/g, ' '),
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
      this.repo.manager,
    );

    this.logger.log({
      func: 'OemCompanyChannelsService/requestChannel',
      body,
      emailMessage,
      result,
      message: 'After requesting a channel',
    });
  }
}
