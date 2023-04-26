import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository, EntityManager, Connection, Not, In } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';

import {
  APP_ROOT_URL,
  VENDORI_COMPANY_ADDRESS,
  VENDORI_SUPPORT_EMAIL,
  MAIL_QUOTE_VENDO_CHANGE_TEMPLATE_ID,
  MAIL_CUSTOMER_UPDATE_TEMPLATE_ID,
  MAIL_VENDO_CONFIRMATION_PATH,
  VENDORI_LOGO_URL,
} from '../../../../environments';

import { OemVendoApprovalQueue } from './oem-vendo-approval-queue.entity';
import { OemVendoApprovalQueueCreateDto } from './oem-vendo-approval-queue.dto/oem-vendo-approval-queue.create.dto';
import { OemVendoApprovalQueueUpdateDto } from './oem-vendo-approval-queue.dto/oem-vendo-approval-queue.update.dto';
import { OemUserEntity } from '../../../main/oem-users/oem-user.entity';
import { OemApprovalQueuePriority } from '../../../main/oem-approval-queue-priorities/oem-approval-queue-priority.entity';
import { VendoApprovalQueueStatusEnum } from './oem-vendo-approval-queue.enums/vendo-approval-queue-status.enum';
import { VendoApprovalQueueTargetTypeEnum } from './oem-vendo-approval-queue.enums/vendo-approval-queue-target-type.enum';
import { OemQuoteEntity } from '../../../main/oem-quotes/oem-quote.entity';
import { QuoteStatusEnum } from '../../../main/oem-quotes/oem-quote.enums/quote-status.enum';
import { OemVendoEntity } from '../../../main/oem-vendos/oem-vendo.entity';
import { VendoStatusEnum } from '../../../main/oem-vendos/oem-vendo.enums/vendo-status.enum';
import { OemVendosUsers } from '../../_oem-vendos-users/oem-vendos-users.entity';
import { sendGridEmailWithDynamicTemplate } from '../../../../shared/email';
import {
  EmailDynamicTemplate,
  EmailMessage,
} from '../../../../shared/email/email.type';
import { OemNotificationsService } from '../../../main/oem-notifications/oem-notifications.service';
import { OemNotificationTypeEnum } from '../../../main/oem-notifications/oem-notification.enums/oem-notification.notification-type.enum';
import { OemVacationRule } from '../../../main/oem-vacation-rules/oem-vacation-rule.entity';
import { OemCustomerEntity } from '../../../main/oem-customers/oem-customer.entity';
import { OemNotification } from '../../../main/oem-notifications/oem-notification.entity';
import { OemNotificationPreference } from '../../../main/oem-notification-preferences/oem-notification-preference.entity';
import { OemNotificationFrequencyType } from '../../../main/oem-notification-preferences/oem-notification-preference.enums/oem-notification-preference.frequency-type.enum';
import { ActionLogs } from '../../../main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../../main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../../main/oem-action-logs/oem-action-log.enums/actions.enum';
import { AuthService } from '../../../../auth/auth.service';
import { RoleAbilityFactory } from '../../../../auth/roles/role-ability.factory';
import { RoleActions } from '../../../../auth/roles/types/role-actions.enum';
import { RoleSubjects } from '../../../../auth/roles/types/role-subjects.type';
import { FunctionTypeEnum } from '../../../main/oem-roles/oem-role.enums/function-type.enum';
import { AddressTypeEnum } from '../../../main/oem-addresses/oem-address.enums/address-type.enum';
import { RoleTypeEnum } from '../../../main/oem-roles/oem-role.enums/role-type.enum';
import { OemQuoteApprovalQueue } from '../_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { CommonDefaultMethodExtension } from '../../../../common/decorators/common-default-method-extention.decorator';

//TODO (REFACTORING): for sending create notification queue we might use typeorm hook
// TODO: I think we need to have an abstact class for approval queue bc we use a lot of duplication for quote and vendo approvals - but they have the same functionality
@Injectable()
@CommonDefaultMethodExtension
export class OemVendoApprovalQueuesService extends TypeOrmCrudService<OemVendoApprovalQueue> {
  private readonly logger = new Logger(OemVendoApprovalQueuesService.name);

  constructor(
    private connection: Connection,
    @InjectRepository(OemVendoApprovalQueue)
    public repo: Repository<OemVendoApprovalQueue>,
    private jwtService: JwtService,
    private notificationsService: OemNotificationsService,
    private authService: AuthService,
    private roleAbilityFactory: RoleAbilityFactory,
  ) {
    super(repo);
  }

  getToken(
    vendoApprovalQueueId: number,
    expiresAt: Date | string,
    now: moment.Moment = moment.utc(),
  ) {
    const expirationDays = moment.utc(expiresAt).diff(now, 'days');
    const token = this.jwtService.sign(
      {
        type: 'vendo_approval_queue',
        id: vendoApprovalQueueId,
      },
      {
        expiresIn: `${expirationDays}d`,
      },
    );

    return token;
  }

  async create(
    dto: Partial<OemVendoApprovalQueueCreateDto>,
    manager: EntityManager,
  ) {
    const user = await manager.findOne(OemUserEntity, {
      where: {
        userId: dto.userId,
      },
    });

    const approvalQueuePriority =
      user &&
      (await manager.findOne(OemApprovalQueuePriority, {
        where: {
          roleId: user.roleId,
        },
      }));

    const now = moment.utc();
    const expiresAt =
      (dto.expiresAt && new Date(dto.expiresAt)) ||
      now.clone().add(1, 'month').toDate();

    const vendoApprovalQueue = await manager.save(
      this.repo.create({
        ...dto,
        approvalQueuePriorityId: approvalQueuePriority?.approvalQueuePriorityId,
        expiresAt,
      }),
    );

    vendoApprovalQueue.token = await this.getToken(
      vendoApprovalQueue.vendoApprovalQueueId,
      expiresAt,
      now,
    );

    return manager.save(vendoApprovalQueue);
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.REJECT)
  async rejectedHandler(
    req,
    currentVendoApprovalQueue: OemVendoApprovalQueue,
    manager: EntityManager,
  ) {
    await manager.update(
      OemVendoApprovalQueue,
      {
        vendoId: currentVendoApprovalQueue.vendoId,
        vendoApprovalQueueId: Not(
          currentVendoApprovalQueue.vendoApprovalQueueId,
        ),
        isEnabled: true,
      },
      {
        isActive: false,
      },
    );

    await manager.update(OemVendoEntity, currentVendoApprovalQueue.vendoId, {
      vendoStatus: VendoStatusEnum.REJECTED,
      isLocked: true,
    });

    await this.sendOrQueueRejectedEmail(
      currentVendoApprovalQueue.vendoId,
      currentVendoApprovalQueue,
      manager,
    );
  }

  //only for action logs
  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.APPROVE)
  async approveEvent(req, updatedVendo) {
    return updatedVendo;
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.TRANSACT)
  async transactEvent(req, updatedVendo) {
    return updatedVendo;
  }

  @ActionLogs(ActionLogTypeEnum.VENDO, ActionsEnum.REJECT)
  async rejectEvent(req, updatedVendo) {
    return updatedVendo;
  }

  async approvedHandler(
    req: CrudRequest | { user: OemUserEntity },
    currentVendoApprovalQueue: OemVendoApprovalQueue,
    manager: EntityManager,
  ) {
    const { vendoId } = currentVendoApprovalQueue;
    const vendo = await manager.findOne(OemVendoEntity, vendoId);
    const { vendoStatus } = vendo;

    const isInternallyApproved = await this.isAllQueuesApproved(
      vendoId,
      false,
      manager,
    );
    const isCustomerApproved = await this.isAllQueuesApproved(
      vendoId,
      true,
      manager,
    );
    if (
      (isInternallyApproved ||
        [
          VendoStatusEnum.APPROVED,
          VendoStatusEnum.AUTO_APPROVED,
          VendoStatusEnum.SENT_EXTERNALLY,
        ].includes(vendoStatus)) &&
      isCustomerApproved
    ) {
      await manager.update(OemVendoEntity, vendoId, {
        vendoStatus: VendoStatusEnum.TRANSACTED,
        isLocked: true,
      });

      const updatedVendo = await manager.findOne(OemVendoEntity, {
        where: {
          vendoId: vendoId,
        },
        relations: ['vendosQuotes'],
      });
      const attachedQuotes = updatedVendo.vendosQuotes;
      //console.log(attachedQuotes);

      this.transactEvent(req, updatedVendo);

      await manager.update(
        OemQuoteEntity,
        {
          quoteId: In(attachedQuotes.map((quote) => quote.quoteId)),
        },
        {
          quoteStatus: QuoteStatusEnum.TRANSACTED,
          isLocked: true,
        },
      );
      await this.sendOrQueueTransactedEmail(vendoId, manager, true);
    } else if (
      vendoStatus === VendoStatusEnum.PENDING_INTERNAL_APPROVAL &&
      isInternallyApproved
    ) {
      await manager.update(OemVendoEntity, vendoId, {
        vendoStatus: VendoStatusEnum.APPROVED,
        isLocked: true,
      });

      const updatedVendo = await manager.findOne(OemVendoEntity, vendoId);
      this.approveEvent(req, updatedVendo);

      await this.sendOrQueueApprovedEmailToOwnerAndSavedAlertUsers(
        vendoId,
        manager,
      );
    }
  }

  async validate(
    req,
    vendoApprovalQueueId: number,
    dto: Partial<OemVendoApprovalQueueUpdateDto>,
    manager: EntityManager,
  ) {
    const allowedStatuses = [
      VendoApprovalQueueStatusEnum.APPROVED,
      VendoApprovalQueueStatusEnum.REJECTED,
    ];
    if (dto.status && !allowedStatuses.includes(dto.status)) {
      throw new BadRequestException('Invalid vendo approval queue status');
    }

    //check if we have pending vendo approval for current role
    const vendoApprovalQueue = await manager
      .createQueryBuilder(OemVendoApprovalQueue, 'vendoApprovalQueue')
      .innerJoin(
        'vendoApprovalQueue.vendo',
        'vendo',
        'vendo.vendoStatus IN (:...vendoStatuses)',
        {
          vendoStatuses: [
            VendoStatusEnum.PENDING_INTERNAL_APPROVAL,
            VendoStatusEnum.AUTO_APPROVED,
            VendoStatusEnum.APPROVED,
            VendoStatusEnum.SENT_EXTERNALLY,
          ],
        },
      )
      .leftJoinAndSelect(
        'vendoApprovalQueue.approvalQueuePriority',
        'approvalQueuePriority',
      )
      .leftJoin('vendoApprovalQueue.user', 'oemUser')
      .leftJoin('oemUser.role', 'role')
      .where(
        `vendoApprovalQueue.isActive = TRUE
        AND vendoApprovalQueue.vendoApprovalQueueId = :vendoApprovalQueueId
        AND vendoApprovalQueue.status = :vendoApprovalQueueStatus
        AND (vendoApprovalQueue.approvalQueuePriorityId IS NULL OR approvalQueuePriority.isActive = TRUE)
        AND (vendoApprovalQueue.userId IS NULL OR (oemUser.isActive = TRUE AND role.isActive = TRUE))`,
        //AND role.roleId = :roleId
        //AND vendoApprovalQueue.userId = :userId
        {
          //userId: req.user.userId,
          //oleId: req.user.roleId,
          vendoApprovalQueueId,
          vendoApprovalQueueStatus: VendoApprovalQueueStatusEnum.PENDING,
        },
      )
      .getOne();

    if (!vendoApprovalQueue) {
      throw new NotFoundException('No pending vendo approval queue found');
    }

    //getting sorted approval queue in general way (it allows us to understand if we)
    const vendoApprovalQueueInTurn = await this.connection.manager
      .createQueryBuilder(OemVendoApprovalQueue, 'vendoApprovalQueue')
      .leftJoinAndSelect(
        'vendoApprovalQueue.approvalQueuePriority',
        'approvalQueuePriority',
      )
      .leftJoin('vendoApprovalQueue.user', 'oemUser')
      .leftJoin('oemUser.role', 'role')
      .where(
        `vendoApprovalQueue.isActive = TRUE
        AND vendoApprovalQueue.vendoId = :vendoId
        AND vendoApprovalQueue.status = :vendoApprovalQueueStatus
        AND (vendoApprovalQueue.approvalQueuePriorityId IS NULL OR approvalQueuePriority.isActive = TRUE)
        AND (vendoApprovalQueue.userId IS NULL OR (oemUser.isActive = TRUE AND role.isActive = TRUE))`,
        {
          vendoId: vendoApprovalQueue.vendoId,
          vendoApprovalQueueStatus: VendoApprovalQueueStatusEnum.PENDING,
        },
      )
      .orderBy('approvalQueuePriority.priority', 'ASC', 'NULLS LAST')
      .getOne();

    if (
      vendoApprovalQueue.approvalQueuePriority?.priority !==
      vendoApprovalQueueInTurn?.approvalQueuePriority?.priority
    ) {
      throw new BadRequestException(`It\'s not your approval turn`);
    }

    return vendoApprovalQueue;
  }

  async update(
    req: CrudRequest & { user: OemUserEntity },
    vendoApprovalQueueId: number,
    dto: Partial<
      OemVendoApprovalQueueUpdateDto & {
        targetType: VendoApprovalQueueTargetTypeEnum;
      }
    >,
    manager: EntityManager,
  ) {
    let vendoApprovalQueue;
    if (req.user.role.roleType == RoleTypeEnum.ADMIN) {
      vendoApprovalQueue = await manager.findOne(OemQuoteApprovalQueue, {
        where: {
          vendoApprovalQueueId,
          isActive: true,
        },
      });
    } else {
      vendoApprovalQueue = await this.validate(
        req,
        vendoApprovalQueueId,
        dto,
        manager,
      );
    }

    if (!vendoApprovalQueue) {
      throw new BadRequestException('No active approval queue found');
    }

    let updatedToken = undefined;
    let status = dto.status || vendoApprovalQueue.status;

    const isRejected =
      vendoApprovalQueue.status !== dto.status &&
      dto.status === VendoApprovalQueueStatusEnum.REJECTED;

    const now = moment.utc();
    const expiresAt =
      (dto.expiresAt && new Date(dto.expiresAt)) ||
      vendoApprovalQueue.expiresAt ||
      now.clone().add(1, 'month').toDate();
    const isExpired = moment.utc(expiresAt).isBefore(now);

    const isApproved =
      vendoApprovalQueue.status !== dto.status &&
      dto.status === VendoApprovalQueueStatusEnum.APPROVED;

    // do not update an expired vendo
    if (isExpired) {
      status = VendoApprovalQueueStatusEnum.EXPIRED;
    } else {
      if (dto.expiresAt !== undefined) {
        updatedToken = this.getToken(
          vendoApprovalQueue.vendoApprovalQueueId,
          expiresAt,
          now,
        );
      }
    }

    const updatedVendoApprovalQueue = await manager.save(
      this.repo.create({
        ..._.omit(vendoApprovalQueue, 'approvalQueuePriority'),
        ...dto,
        status,
        token: updatedToken,
      }),
    );

    //update with the same priority
    await manager.update(
      OemVendoApprovalQueue,
      {
        isEnabled: true,
        approvalQueuePriorityId: vendoApprovalQueue.approvalQueuePriorityId,
        targetType: vendoApprovalQueue.targetType,
        vendoId: vendoApprovalQueue.vendoId,
      },
      { status: dto.status },
    );

    if (isExpired) {
      return updatedVendoApprovalQueue;
    } else if (isRejected) {
      await this.rejectedHandler(req, updatedVendoApprovalQueue, manager);
    } else if (isApproved) {
      await this.approvedHandler(req, updatedVendoApprovalQueue, manager);
    }

    return updatedVendoApprovalQueue;
  }

  async updateOne(
    req: CrudRequest & { user: OemUserEntity },
    dto: Partial<OemVendoApprovalQueueUpdateDto>,
  ): Promise<OemVendoApprovalQueue> {
    return this.connection.transaction(async (manager) => {
      const id = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );
      return this.update(req, id.value, dto, manager);
    });
  }

  /**
   *
   * @param data: { vendoId, externalUsers }
   * @param targetTypes - [INTERNAL, EXTERNAL, CUSTOMER]
   * @param manager
   * @private
   * @description Create approval queue. *CUSTOMER - this is eApprover - the person who can make quote transacted.
   */
  //TODO: my thoughts that it might be broken bc isWorkflowUser is always set to TRUE
  private async _createVendoApprovalQueues(
    data: { vendoId: number; externalUsers?: Array<OemUserEntity> },
    targetTypes: Array<VendoApprovalQueueTargetTypeEnum>,
    manager: EntityManager,
  ) {
    // create new quote approval queues
    const vendoUsers = await manager.find(OemVendosUsers, {
      where: {
        isEnabled: true,
        isSavedAlertUser: false, // why we need this?
        vendoId: data.vendoId,
      },
      relations: ['user', 'user.role'],
    });

    for (const vendoUser of vendoUsers) {
      const targetType = vendoUser.isApprover
        ? VendoApprovalQueueTargetTypeEnum.CUSTOMER
        : vendoUser.user?.isExternal
        ? VendoApprovalQueueTargetTypeEnum.EXTERNAL
        : VendoApprovalQueueTargetTypeEnum.INTERNAL;

      // Check the admin role when sending internally
      if (vendoUser.user.role?.functionType !== FunctionTypeEnum.ADMIN) {
        // Check if external user allowed to be added to queue
        if (vendoUser.isOwner) continue;

        // Check if internal user allowed to be added to queue
        if (
          !vendoUser.isApprover &&
          vendoUser.user?.isExternal === false &&
          !targetTypes.includes(VendoApprovalQueueTargetTypeEnum.INTERNAL)
        )
          continue;

        // Check if selected user is allowed to be added to queue
        if (
          targetType !== VendoApprovalQueueTargetTypeEnum.INTERNAL &&
          data.externalUsers?.length &&
          !data.externalUsers.find(
            (user) => user.userId === vendoUser.user?.userId,
          )
        ) {
          continue;
        }

        // Check if the user role is allowed for approval
        const ability = await this.roleAbilityFactory.createForUser(
          vendoUser.user,
        );
        if (
          ability.cannot(RoleActions.Modify, RoleSubjects.VendoApprovalQueue)
        ) {
          continue;
        }
      }

      if (
        !vendoUser.isApprover &&
        vendoUser.user?.isExternal &&
        !targetTypes.includes(VendoApprovalQueueTargetTypeEnum.EXTERNAL)
      )
        continue;

      // Check if eApprover user allowed to be added to queue
      if (
        vendoUser.isApprover &&
        !targetTypes.includes(VendoApprovalQueueTargetTypeEnum.CUSTOMER)
      ) {
        continue;
      }

      // Check if eApprover user allowed to be added to queue
      if (
        !vendoUser.user?.isExternal &&
        (targetTypes.includes(VendoApprovalQueueTargetTypeEnum.CUSTOMER) ||
          targetTypes.includes(VendoApprovalQueueTargetTypeEnum.EXTERNAL))
      ) {
        continue;
      }

      await this.create(
        {
          companyId: vendoUser.companyId,
          vendoId: vendoUser.vendoId,
          userId: vendoUser.userId,
          targetType,
        },
        manager,
      );
    }
  }

  async deactivateVendoApprovalQueues(vendoId: number, manager: EntityManager) {
    await manager.update(
      OemVendoApprovalQueue,
      {
        isEnabled: true,
        vendoId,
      },
      { isActive: false },
    );
  }

  async vendoResubmitHandler(
    req,
    updatedVendo: OemVendoEntity,
    manager: EntityManager,
  ) {
    const { vendoStatus: updatedStatus } = updatedVendo;

    const isPending =
      updatedStatus === VendoStatusEnum.PENDING_INTERNAL_APPROVAL;
    const isAutoApproved = updatedStatus === VendoStatusEnum.AUTO_APPROVED;
    const isApproved = updatedStatus === VendoStatusEnum.APPROVED;
    const isPendingCustomerAcceptance =
      updatedStatus === VendoStatusEnum.SENT_EXTERNALLY;
    const isTransacted = updatedStatus === VendoStatusEnum.TRANSACTED;

    if (
      isPending ||
      isAutoApproved ||
      isApproved ||
      isPendingCustomerAcceptance
    ) {
      // disable all the vendo approval queues
      await this.deactivateVendoApprovalQueues(updatedVendo.vendoId, manager);

      await manager.update(
        OemNotification,
        {
          isEnabled: true,
          vendoId: updatedVendo.vendoId,
        },
        { isEnabled: false },
      );
    }

    if (isPending) {
      // create new vendo approval queues
      await this._createVendoApprovalQueues(
        { vendoId: updatedVendo.vendoId },
        [VendoApprovalQueueTargetTypeEnum.INTERNAL],
        manager,
      );
    }

    if (isAutoApproved || isApproved || isPendingCustomerAcceptance) {
      await this._createVendoApprovalQueues(
        {
          vendoId: updatedVendo.vendoId,
          externalUsers: req.externalUsers,
        },
        [
          VendoApprovalQueueTargetTypeEnum.EXTERNAL,
          VendoApprovalQueueTargetTypeEnum.CUSTOMER,
        ],
        manager,
      );

      await this.sendOrQueueApprovedEmail(
        { vendo: updatedVendo, externalUsers: req.externalUsers },
        manager,
      );

      if (isAutoApproved) {
        await this.sendOrQueueApprovedEmailToOwnerAndSavedAlertUsers(
          updatedVendo.vendoId,
          manager,
        );
      }
    } else if (isTransacted) {
      await this.sendOrQueueTransactedEmail(
        updatedVendo.vendoId,
        manager,
        false,
      );
    } else if (isPending) {
      await this.sendOrQueueSubmittedEmail(updatedVendo.vendoId, manager);
    }
  }

  async sendOrQueueApprovalEmail(
    vendo: OemVendoEntity,
    manager: EntityManager,
  ) {
    if (vendo.vendoStatus !== VendoStatusEnum.PENDING_INTERNAL_APPROVAL) {
      return;
    }

    const vendoApprovalQueue = await manager
      .createQueryBuilder(OemVendoApprovalQueue, 'vendoApprovalQueue')
      .innerJoinAndSelect('vendoApprovalQueue.company', 'company')
      .innerJoin(
        'vendoApprovalQueue.approvalQueuePriority',
        'approvalQueuePriority',
        'approvalQueuePriority.isActive = TRUE',
      )
      .innerJoinAndSelect(
        'vendoApprovalQueue.user',
        'oemUser',
        'oemUser.isActive = TRUE',
      )
      .innerJoinAndSelect('oemUser.role', 'role', 'role.isActive = TRUE')
      .leftJoinAndSelect(
        'vendoApprovalQueue.notifications',
        'notifications',
        `notifications.notificationType = :notificationType AND notifications.isEnabled = TRUE`,
        { notificationType: OemNotificationTypeEnum.VENDO_SUBMITTED },
      )
      .where(
        `
        vendoApprovalQueue.isActive = TRUE
        AND vendoApprovalQueue.vendoId = :vendoId
        AND vendoApprovalQueue.companyId = :companyId
        AND vendoApprovalQueue.status = :vendoApprovalQueueStatus
        `,
        {
          vendoId: vendo.vendoId,
          companyId: vendo.companyId,
          vendoApprovalQueueStatus: VendoApprovalQueueStatusEnum.PENDING,
        },
      )
      .orderBy('approvalQueuePriority.priority')
      .getOne();

    if (!vendoApprovalQueue || vendoApprovalQueue.notifications.length > 0) {
      return;
    }

    const ownerVendoUser = await manager
      .createQueryBuilder(OemVendosUsers, 'vendoUser')
      .innerJoinAndSelect('vendoUser.user', 'user')
      .where('vendoUser.vendoId = :vendoId AND vendoUser.isOwner = TRUE', {
        vendoId: vendo.vendoId,
      })
      .getOne();

    if (!ownerVendoUser) {
      return;
    }

    const vacationRule = await manager.findOne(OemVacationRule, {
      where: {
        sourceUserId: vendoApprovalQueue.userId,
        isActive: true,
      },
      relations: ['targetUser'],
    });
    const targetUser = vacationRule?.targetUser || vendoApprovalQueue.user;

    const notificationPreference = await manager.findOne(
      OemNotificationPreference,
      targetUser.userId,
    );
    if (
      notificationPreference?.submissionFrequencyType ===
      OemNotificationFrequencyType.NEVER
    ) {
      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueApprovalEmail',
        vendoId: vendo.vendoId,
        vendoApprovalQueueId: vendoApprovalQueue.vendoApprovalQueueId,
        message:
          'Skip sending an approval email due to the notification preference',
      });

      return;
    }

    const customer = await manager.findOne(OemCustomerEntity, {
      where: { customerId: vendo.customerId },
    });

    const subject = `Vendo ${vendo.vendoName} is ready for review`;
    const email = targetUser.notificationEmail || targetUser.ssoLoginEmail;

    const dynamicTemplateData: EmailDynamicTemplate = {
      logoURL: VENDORI_LOGO_URL,
      //logoURL: vendo.company?.logoUrl,
      CTA: `${APP_ROOT_URL}/vendos/${vendo.vendoId}`,
      subject,
      body: `${ownerVendoUser.user.fullName} has submitted a vendo that requires your approval.<br/><br/>
        <strong> ${customer?.customerName} | ${vendo.vendoUuid} </strong><br/><br/>
        Please click below to review the vendo and approve or deny it.`,
      companyAddress: VENDORI_COMPANY_ADDRESS,
      emailverify: `This message was sent to ${email} because you're a user in the ${vendoApprovalQueue.user.fullName} Vendori account. To manage future email notifications, click https://demo.vendori.com/manage-alerts or go to your notifications page within the app.`,
      isVendo: true,
    };

    const emailMessage: EmailMessage = {
      subject,
      from: {
        name: 'Vendori',
        email: VENDORI_SUPPORT_EMAIL,
      },
      to: [
        {
          name: targetUser.fullName,
          email,
        },
      ],
      templateId: MAIL_QUOTE_VENDO_CHANGE_TEMPLATE_ID,
      dynamicTemplateData,
    };

    if (
      !notificationPreference ||
      notificationPreference?.submissionFrequencyType ===
        OemNotificationFrequencyType.IMMEDIATELY
    ) {
      const result = await sendGridEmailWithDynamicTemplate(emailMessage);
      const messageId = result[0].headers['x-message-id'];

      await this.notificationsService.create(
        {
          companyId: vendo.companyId,
          vendoApprovalQueueId: vendoApprovalQueue.vendoApprovalQueueId,
          vendoId: vendo.vendoId,
          receiverId: targetUser.userId,
          customerId: vendo.customerId,
          fromEmail: VENDORI_SUPPORT_EMAIL,
          toEmail: email,
          messageId,
          metaData: emailMessage,
          notificationType: OemNotificationTypeEnum.VENDO_SUBMITTED,
          sentAt: new Date(),
          status: 'requested',
          subject,
        },
        manager,
      );

      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueApprovalEmail',
        emailMessage,
        result,
        message: 'After sending approval email',
      });
    } else {
      await this.notificationsService.create(
        {
          companyId: vendo.companyId,
          vendoApprovalQueueId: vendoApprovalQueue.vendoApprovalQueueId,
          vendoId: vendo.vendoId,
          receiverId: targetUser.userId,
          customerId: vendo.customerId,
          fromEmail: VENDORI_SUPPORT_EMAIL,
          toEmail: email,
          notificationType: OemNotificationTypeEnum.VENDO_SUBMITTED,
          status: 'pending',
        },
        manager,
      );

      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueApprovalEmail',
        vendoId: vendo.vendoId,
        vendoApprovalQueueId: vendoApprovalQueue.vendoApprovalQueueId,
        message: 'After queueing an approval email',
      });
    }
  }

  async sendOrQueueSubmittedEmail(vendoId: number, manager: EntityManager) {
    // send to the owner and saved alert users
    const vendo = await manager
      .createQueryBuilder(OemVendoEntity, 'vendo')
      .innerJoinAndSelect('vendo.company', 'company')
      .leftJoinAndSelect('vendo.customer', 'customer')
      .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
      .leftJoinAndSelect('customerAddresses.address', 'address')
      .innerJoinAndSelect(
        'vendo.vendosUsers',
        'vendoUsers',
        `vendoUsers.isOwner = TRUE OR vendoUsers.approvalStatus = :approvalStatus`,
        { approvalStatus: VendoStatusEnum.PENDING_INTERNAL_APPROVAL },
      )
      .innerJoinAndSelect('vendoUsers.user', 'user', 'user.isActive = TRUE')
      .leftJoinAndSelect(
        'vendo.notifications',
        'notifications',
        `notifications.notificationType = :notificationType AND notifications.isEnabled = TRUE`,
        { notificationType: OemNotificationTypeEnum.VENDO_SUBMITTED },
      )
      .where('vendo.vendoId = :vendoId', {
        vendoId,
      })
      .getOne();

    if (!vendo || vendo.notifications.length > 0) {
      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueSubmittedEmail',
        vendoId,
        notificationIds: vendo?.notifications.map(
          (notification) => notification.notificationId,
        ),
        message: 'Skip sending submitted email',
      });

      return;
    }

    const ownerVendoUser = await manager
      .createQueryBuilder(OemVendosUsers, 'vendoUser')
      .innerJoinAndSelect('vendoUser.user', 'user')
      .where('vendoUser.vendoId = :vendoId AND vendoUser.isOwner = TRUE', {
        vendoId: vendo.vendoId,
      })
      .getOne();

    if (!ownerVendoUser) {
      return;
    }

    const emailList: {
      userId: number;
      name: string;
      email: string;
    }[] = [];
    const batchList: {
      userId: number;
      name: string;
      email: string;
    }[] = [];

    for (const vendoUser of vendo.vendosUsers) {
      const vacationRule = await manager.findOne(OemVacationRule, {
        where: {
          sourceUserId: vendoUser.userId,
        },
        relations: ['targetUser'],
      });
      const targetUser = vacationRule?.targetUser || vendoUser.user;

      const notificationPreference = await manager.findOne(
        OemNotificationPreference,
        targetUser.userId,
      );
      if (
        notificationPreference?.approvalFrequencyType ===
        OemNotificationFrequencyType.NEVER
      ) {
        continue;
      }

      if (
        !notificationPreference ||
        notificationPreference.approvalFrequencyType ===
          OemNotificationFrequencyType.IMMEDIATELY
      ) {
        emailList.push({
          userId: targetUser.userId,
          name: targetUser.fullName,
          email: targetUser.notificationEmail || targetUser.ssoLoginEmail,
        });
      } else {
        batchList.push({
          userId: targetUser.userId,
          name: targetUser.fullName,
          email: targetUser.notificationEmail || targetUser.ssoLoginEmail,
        });
      }
    }
    const subject = `${ownerVendoUser.user.fullName} has submitted a proposal!`;

    const dynamicTemplateData: EmailDynamicTemplate = {
      logoURL: VENDORI_LOGO_URL,
      //logoURL: vendo.company.logoUrl,
      CTA: `${APP_ROOT_URL}/vendos/${vendo.vendoId}`,
      subject,
      body: `
        To view this proposal, please click below.<br/><br/>
        <strong> ${vendo.company.companyName} | ${ownerVendoUser.user.phone} | ${ownerVendoUser.user.region} </strong>
      `,
      companyAddress: VENDORI_COMPANY_ADDRESS,
      emailverify: `This message was sent to your email because you're a user in the Vendori account. To manage future email notifications, click https://demo.vendori.com/manage-alerts or go to your notifications page within the app.`,
      isVendo: false,
    };

    const emailMessage: EmailMessage = {
      subject,
      from: {
        name: 'Vendori',
        email: VENDORI_SUPPORT_EMAIL,
      },
      to: emailList.map((el) => _.omit(el, 'userId')),
      templateId: MAIL_QUOTE_VENDO_CHANGE_TEMPLATE_ID,
      dynamicTemplateData,
    };

    if (emailList.length > 0) {
      const result = await sendGridEmailWithDynamicTemplate(emailMessage);
      const messageId = result[0].headers['x-message-id'];

      for (const el of emailList) {
        await this.notificationsService.create(
          {
            companyId: vendo.companyId,
            vendoId: vendo.vendoId,
            customerId: vendo.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            messageId,
            metaData: emailMessage,
            notificationType: OemNotificationTypeEnum.VENDO_SUBMITTED,
            sentAt: new Date(),
            status: 'requested',
            subject,
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueSubmittedEmail',
        vendoId,
        emailMessage,
        result,
        message: 'After sending submitted email',
      });
    }

    if (batchList.length > 0) {
      for (const el of batchList) {
        await this.notificationsService.create(
          {
            companyId: vendo.companyId,
            vendoId: vendo.vendoId,
            customerId: vendo.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            notificationType: OemNotificationTypeEnum.VENDO_SUBMITTED,
            status: 'pending',
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueSubmittedEmail',
        vendoId,
        message: 'After queuing submitted email',
      });
    }
  }

  async sendOrQueueApprovedEmail(
    data: { vendo: OemVendoEntity; externalUsers: Array<OemUserEntity> },
    manager: EntityManager,
  ) {
    const { vendo } = data;

    // send to the customer and external users when approved by everyone or auto-approved
    const vendoApprovalQueues = await manager
      .createQueryBuilder(OemVendoApprovalQueue, 'vendoApprovalQueue')
      .innerJoinAndSelect('vendoApprovalQueue.company', 'company')
      .innerJoinAndSelect(
        'vendoApprovalQueue.user',
        'oemUser',
        'oemUser.isActive = TRUE',
      )
      .innerJoinAndSelect('oemUser.role', 'role', 'role.isActive = TRUE')
      .leftJoinAndSelect(
        'vendoApprovalQueue.notifications',
        'notifications',
        `notifications.notificationType = :notificationType AND notifications.isEnabled = TRUE`,
        { notificationType: OemNotificationTypeEnum.VENDO_APPROVED },
      )
      .where(
        `
          vendoApprovalQueue.isActive = TRUE
          AND vendoApprovalQueue.vendoId = :vendoId
          AND vendoApprovalQueue.companyId = :companyId
          AND vendoApprovalQueue.status = :vendoApprovalQueueStatus
          AND vendoApprovalQueue.targetType IN (:...targetTypes)`,
        {
          vendoId: data.vendo.vendoId,
          companyId: data.vendo.companyId,
          vendoApprovalQueueStatus: VendoApprovalQueueStatusEnum.PENDING,
          targetTypes: [
            VendoApprovalQueueTargetTypeEnum.CUSTOMER,
            VendoApprovalQueueTargetTypeEnum.EXTERNAL,
          ],
        },
      )
      .getMany();

    for (const vendoApprovalQueue of vendoApprovalQueues) {
      if (!vendoApprovalQueue || vendoApprovalQueue.notifications.length > 0) {
        this.logger.log({
          func: 'OemVendoApprovalQueuesService/sendOrQueueApprovedEmail',
          vendoId: vendo.vendoId,
          notificationIds: vendo?.notifications.map(
            (notification) => notification.notificationId,
          ),
          message: 'Skip sending approved email',
        });

        return;
      }

      const ownerVendoUser = await manager
        .createQueryBuilder(OemVendosUsers, 'vendoUser')
        .innerJoinAndSelect('vendoUser.user', 'user')
        .where('vendoUser.vendoId = :vendoId AND vendoUser.isOwner = TRUE', {
          vendoId: vendo.vendoId,
        })
        .getOne();

      if (!ownerVendoUser) {
        return;
      }

      const notificationPreference = await manager.findOne(
        OemNotificationPreference,
        vendoApprovalQueue.userId,
      );
      if (
        notificationPreference?.approvalFrequencyType ===
        OemNotificationFrequencyType.NEVER
      ) {
        this.logger.log({
          func: 'OemVendoApprovalQueuesService/sendOrQueueApprovedEmail',
          vendoId: vendo.vendoId,
          vendoApprovalQueueId: vendoApprovalQueue.vendoApprovalQueueId,
          message:
            'Skip sending an approved email due to the notification preference',
        });

        return;
      }

      const subject = `${ownerVendoUser.user.fullName} has sent you a proposal!`;

      const email =
        vendoApprovalQueue.user.notificationEmail ||
        vendoApprovalQueue.user.ssoLoginEmail;

      const { access_token } = await this.authService.loginUser(
        vendoApprovalQueue.user,
      );
      const confirmationLink = `https://${vendoApprovalQueue.company.subdomain}.vendori.com/${MAIL_VENDO_CONFIRMATION_PATH}/${vendoApprovalQueue.vendoApprovalQueueId}?access_token=${access_token}`;

      const dynamicTemplateData: EmailDynamicTemplate = {
        isVendo: true,
        logoURL: VENDORI_LOGO_URL,
        CTA: confirmationLink, // `${APP_ROOT_URL}/vendos/${vendo.vendoId}`,
        subject,
        body: `To view and approve this proposal, please click below.<br/><br/>
        <strong> ${vendoApprovalQueue.company.companyName} | ${ownerVendoUser.user.phone} | ${vendo.vendoUuid} </strong>`,
        companyAddress: VENDORI_COMPANY_ADDRESS,
        emailverify: `This message was sent to ${email} because you're a user in the ${vendoApprovalQueue.user.fullName} Vendori account.
        To manage future email notifications, click https://demo.vendori.com/manage-alerts or go to your notifications page within the app.`,
      };

      const emailMessage: EmailMessage = {
        subject,
        from: {
          name: 'Vendori',
          email: VENDORI_SUPPORT_EMAIL,
        },
        to: [
          {
            name: vendoApprovalQueue.user.fullName,
            email,
          },
        ],
        templateId: MAIL_CUSTOMER_UPDATE_TEMPLATE_ID,
        dynamicTemplateData,
      };

      if (
        !notificationPreference ||
        notificationPreference?.approvalFrequencyType ===
          OemNotificationFrequencyType.IMMEDIATELY
      ) {
        const result = await sendGridEmailWithDynamicTemplate(emailMessage);
        const messageId = result[0].headers['x-message-id'];

        await this.notificationsService.create(
          {
            companyId: vendoApprovalQueue.companyId,
            vendoId: vendoApprovalQueue.vendoId,
            receiverId: vendoApprovalQueue.user.userId,
            customerId: vendo.customerId,
            vendoApprovalQueueId: vendoApprovalQueue.vendoApprovalQueueId, //vendoApprovalQueue.approvalQueuePriorityId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: email,
            messageId,
            metaData: emailMessage,
            notificationType: OemNotificationTypeEnum.VENDO_APPROVED,
            sentAt: new Date(),
            status: 'requested',
            subject,
          },
          manager,
        );

        this.logger.log({
          func: 'OemVendoApprovalQueuesService/sendOrQueueApprovedEmail',
          userId: vendoApprovalQueue.userId,
          confirmationLink: confirmationLink,
          emailMessage,
          result,
          message: 'After sending an approved email',
        });
      } else {
        await this.notificationsService.create(
          {
            companyId: vendoApprovalQueue.companyId,
            vendoId: vendoApprovalQueue.vendoId,
            receiverId: vendoApprovalQueue.user.userId,
            customerId: vendo.customerId,
            vendoApprovalQueueId: vendoApprovalQueue.vendoApprovalQueueId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: email,
            notificationType: OemNotificationTypeEnum.VENDO_APPROVED,
            status: 'pending',
          },
          manager,
        );

        this.logger.log({
          func: 'OemVendoApprovalQueuesService/sendOrQueueApprovedEmail',
          vendoId: vendo.vendoId,
          vendoApprovalQueueId: vendoApprovalQueue.vendoApprovalQueueId,
          message: 'After queuing an approved email',
        });
      }
    }
  }

  private _getCustomerAddress(customer: OemCustomerEntity) {
    const billingAddress = customer.customerAddresses
      .map((customerAddr) => customerAddr.address)
      .find((addr) => addr.addressType === AddressTypeEnum.BILLING);
    const shippingAddress = customer.customerAddresses
      .map((customerAddr) => customerAddr.address)
      .find((addr) => addr.addressType === AddressTypeEnum.SHIPPING);
    return billingAddress || shippingAddress;
  }

  async sendOrQueueApprovedEmailToOwnerAndSavedAlertUsers(
    vendoId: number,
    manager: EntityManager,
  ) {
    // send to the owner and saved alert users
    const vendo = await manager
      .createQueryBuilder(OemVendoEntity, 'vendo')
      .innerJoinAndSelect('vendo.company', 'company')
      .leftJoinAndSelect('vendo.customer', 'customer')
      .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
      .leftJoinAndSelect('customerAddresses.address', 'address')
      .innerJoinAndSelect(
        'vendo.vendosUsers',
        'vendoUsers',
        `vendoUsers.isOwner = TRUE OR vendoUsers.approvalStatus IN (:...approvalStatuses)`,
        {
          approvalStatuses: [
            VendoStatusEnum.APPROVED,
            VendoStatusEnum.AUTO_APPROVED,
            VendoStatusEnum.SENT_EXTERNALLY,
          ],
        },
      )
      .innerJoinAndSelect('vendoUsers.user', 'user', 'user.isActive = TRUE')
      .leftJoinAndSelect(
        'vendo.notifications',
        'notifications',
        `notifications.notificationType = :notificationType AND notifications.isEnabled = TRUE`,
        { notificationType: OemNotificationTypeEnum.VENDO_APPROVED },
      )
      .where('vendo.vendoId = :vendoId', {
        vendoId,
      })
      .getOne();

    if (!vendo || vendo.notifications.length > 0) {
      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueApprovedEmailToOwnerAndSavedAlertUsers',
        vendoId,
        notificationIds: vendo?.notifications.map(
          (notification) => notification.notificationId,
        ),
        message: 'Skip sending approved email',
      });

      return;
    }

    const emailList: {
      userId: number;
      name: string;
      email: string;
    }[] = [];
    const batchList: {
      userId: number;
      name: string;
      email: string;
    }[] = [];

    for (const vendoUser of vendo.vendosUsers) {
      const vacationRule = await manager.findOne(OemVacationRule, {
        where: {
          sourceUserId: vendoUser.userId,
        },
        relations: ['targetUser'],
      });
      const targetUser = vacationRule?.targetUser || vendoUser.user;

      const notificationPreference = await manager.findOne(
        OemNotificationPreference,
        targetUser.userId,
      );
      if (
        notificationPreference?.approvalFrequencyType ===
        OemNotificationFrequencyType.NEVER
      ) {
        continue;
      }

      if (
        !notificationPreference ||
        notificationPreference.approvalFrequencyType ===
          OemNotificationFrequencyType.IMMEDIATELY
      ) {
        emailList.push({
          userId: targetUser.userId,
          name: targetUser.fullName,
          email: targetUser.notificationEmail || targetUser.ssoLoginEmail,
        });
      } else {
        batchList.push({
          userId: targetUser.userId,
          name: targetUser.fullName,
          email: targetUser.notificationEmail || targetUser.ssoLoginEmail,
        });
      }
    }
    const approvalStatus =
      vendo.vendoStatus === VendoStatusEnum.APPROVED
        ? 'approved'
        : 'auto-approved';
    const subject = `Vendo ${vendo.vendoName} has been ${approvalStatus}`;
    const customerAddress = this._getCustomerAddress(vendo.customer);
    const dynamicTemplateData: EmailDynamicTemplate = {
      logoURL: VENDORI_LOGO_URL,
      CTA: `${APP_ROOT_URL}/vendos/${vendo.vendoId}`,
      subject,
      body: `Vendo ${vendo.vendoName} has been ${approvalStatus}.<br/><br/> <strong> ${vendo.company.companyName} | ${customerAddress.region} </strong>`,
      companyAddress: VENDORI_COMPANY_ADDRESS,
      emailverify: `This message was sent to your email because you're a user in the Vendori account. To manage future email notifications, click https://demo.vendori.com/manage-alerts or go to your notifications page within the app.`,
      isVendo: false,
    };

    const emailMessage: EmailMessage = {
      subject,
      from: {
        name: 'Vendori',
        email: VENDORI_SUPPORT_EMAIL,
      },
      to: emailList.map((el) => _.omit(el, 'userId')),
      templateId: MAIL_QUOTE_VENDO_CHANGE_TEMPLATE_ID,
      dynamicTemplateData,
    };

    if (emailList.length > 0) {
      const result = await sendGridEmailWithDynamicTemplate(emailMessage);
      const messageId = result[0].headers['x-message-id'];

      for (const el of emailList) {
        await this.notificationsService.create(
          {
            companyId: vendo.companyId,
            vendoId: vendo.vendoId,
            customerId: vendo.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            messageId,
            metaData: emailMessage,
            notificationType: OemNotificationTypeEnum.VENDO_APPROVED,
            sentAt: new Date(),
            status: 'requested',
            subject,
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueApprovedEmailToOwnerAndSavedAlertUsers',
        vendoId,
        emailMessage,
        result,
        message: 'After sending approved email',
      });
    }

    if (batchList.length > 0) {
      for (const el of batchList) {
        await this.notificationsService.create(
          {
            companyId: vendo.companyId,
            vendoId: vendo.vendoId,
            customerId: vendo.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            notificationType: OemNotificationTypeEnum.VENDO_APPROVED,
            status: 'pending',
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueApprovedEmailToOwnerAndSavedAlertUsers',
        vendoId,
        message: 'After queuing approved email',
      });
    }
  }

  async sendOrQueueRejectedEmail(
    vendoId: number,
    vendoApprovalQueue: OemVendoApprovalQueue,
    manager: EntityManager,
  ) {
    // send to the remaining approvers, the owner, and saved alert users
    const vendo = await manager
      .createQueryBuilder(OemVendoEntity, 'vendo')
      .innerJoinAndSelect('vendo.company', 'company')
      .leftJoinAndSelect('vendo.customer', 'customer')
      .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
      .leftJoinAndSelect('customerAddresses.address', 'address')
      .leftJoin(
        'vendo.vendoApprovalQueues',
        'vendoApprovalQueues',
        'vendoApprovalQueues.isActive = TRUE AND vendoApprovalQueues.status = :vendoApprovalQueueStatus',
        {
          vendoApprovalQueueStatus: VendoApprovalQueueStatusEnum.PENDING,
        },
      )
      .innerJoinAndSelect(
        'vendo.vendosUsers',
        'vendoUsers',
        `vendoUsers.userId = vendoApprovalQueues.userId
          OR vendoUsers.isOwner = TRUE
          OR vendoUsers.approvalStatus = :approvalStatus`,
        { approvalStatus: VendoStatusEnum.REJECTED },
      )
      .innerJoinAndSelect('vendoUsers.user', 'user', 'user.isActive = TRUE')
      .leftJoinAndSelect(
        'vendo.notifications',
        'notifications',
        `notifications.notificationType = :notificationType AND notifications.isEnabled = TRUE`,
        { notificationType: OemNotificationTypeEnum.VENDO_REJECTED },
      )
      .where('vendo.vendoId = :vendoId', {
        vendoId,
      })
      .getOne();

    if (!vendo || vendo.notifications.length > 0) {
      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueRejectedEmail',
        vendoId,
        notificationIds: vendo?.notifications.map(
          (notification) => notification.notificationId,
        ),
        message: 'Skip sending rejected email',
      });

      return;
    }

    const rejectedUser = await manager.findOne(
      OemUserEntity,
      vendoApprovalQueue.userId,
      {
        relations: ['role'],
      },
    );
    const rejectedRole = rejectedUser?.role.roleType || 'Customer';

    const emailList: {
      userId: number;
      name: string;
      email: string;
    }[] = [];
    const batchList: {
      userId: number;
      name: string;
      email: string;
    }[] = [];

    for (const vendoUser of vendo.vendosUsers) {
      const vacationRule = await manager.findOne(OemVacationRule, {
        where: {
          sourceUserId: vendoUser.userId,
          isActive: true,
        },
        relations: ['targetUser'],
      });
      const targetUser = vacationRule?.targetUser || vendoUser.user;

      const notificationPreference = await manager.findOne(
        OemNotificationPreference,
        targetUser.userId,
      );
      if (
        notificationPreference?.approvalFrequencyType ===
        OemNotificationFrequencyType.NEVER
      ) {
        continue;
      }

      if (
        !notificationPreference ||
        notificationPreference.approvalFrequencyType ===
          OemNotificationFrequencyType.IMMEDIATELY
      ) {
        emailList.push({
          userId: targetUser.userId,
          name: targetUser.fullName,
          email: targetUser.notificationEmail || targetUser.ssoLoginEmail,
        });
      } else {
        batchList.push({
          userId: targetUser.userId,
          name: targetUser.fullName,
          email: targetUser.notificationEmail || targetUser.ssoLoginEmail,
        });
      }
    }
    const subject = `Vendo ${vendo.vendoName} has been rejected`;
    const customerAddress = this._getCustomerAddress(vendo.customer);
    const dynamicTemplateData: EmailDynamicTemplate = {
      logoURL: VENDORI_LOGO_URL,
      CTA: `${APP_ROOT_URL}/vendos/${vendo.vendoId}`,
      subject,
      body: `${rejectedRole} rejected the vendo.<br/><br/> <strong> ${vendo.company.companyName} | ${customerAddress.region} </strong>`,
      companyAddress: VENDORI_COMPANY_ADDRESS,
      emailverify: `This message was sent to your email because you're a user in the Vendori account. To manage future email notifications, click https://demo.vendori.com/manage-alerts or go to your notifications page within the app.`,
      isVendo: true,
    };

    const emailMessage: EmailMessage = {
      subject,
      from: {
        name: 'Vendori',
        email: VENDORI_SUPPORT_EMAIL,
      },
      to: emailList.map((el) => _.omit(el, 'userId')),
      templateId: MAIL_QUOTE_VENDO_CHANGE_TEMPLATE_ID,
      dynamicTemplateData,
    };

    if (emailList.length > 0) {
      const result = await sendGridEmailWithDynamicTemplate(emailMessage);
      const messageId = result[0].headers['x-message-id'];

      for (const el of emailList) {
        await this.notificationsService.create(
          {
            companyId: vendo.companyId,
            vendoId: vendo.vendoId,
            customerId: vendo.customerId,
            receiverId: el.userId,
            vendoApprovalQueueId: vendoApprovalQueue.vendoApprovalQueueId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            messageId,
            metaData: emailMessage,
            notificationType: OemNotificationTypeEnum.VENDO_REJECTED,
            sentAt: new Date(),
            status: 'requested',
            subject,
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueRejectedEmail',
        emailMessage,
        result,
        message: 'After sending rejected email',
      });
    }

    if (batchList.length > 0) {
      for (const el of batchList) {
        await this.notificationsService.create(
          {
            companyId: vendo.companyId,
            vendoId: vendo.vendoId,
            customerId: vendo.customerId,
            receiverId: el.userId,
            vendoApprovalQueueId: vendoApprovalQueue.vendoApprovalQueueId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            notificationType: OemNotificationTypeEnum.VENDO_REJECTED,
            status: 'pending',
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueRejectedEmail',
        vendoId,
        message: 'After queuing rejected email',
      });
    }
  }

  async sendOrQueueExpiredEmail(vendoId: number, manager: EntityManager) {
    // send to the remaining approvers, the owner, and saved alert users, except for the customer
    const vendo = await manager
      .createQueryBuilder(OemVendoEntity, 'vendo')
      .innerJoinAndSelect('vendo.company', 'company')
      .leftJoinAndSelect('vendo.customer', 'customer')
      .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
      .leftJoinAndSelect('customerAddresses.address', 'address')
      .innerJoinAndSelect(
        'vendo.vendosUsers',
        'vendoUsers',
        `
          vendoUsers.isApprover = FALSE AND
          (vendoUsers.isSavedAlertUser = FALSE
          OR vendoUsers.approvalStatus = :approvalStatus)`,
        {
          approvalStatus: VendoStatusEnum.EXPIRED,
        },
      )
      .innerJoinAndSelect('vendoUsers.user', 'user', 'user.isActive = TRUE')
      .leftJoinAndSelect(
        'vendo.notifications',
        'notifications',
        `notifications.notificationType = :notificationType AND notifications.isEnabled = TRUE`,
        { notificationType: OemNotificationTypeEnum.VENDO_EXPIRED },
      )
      .where('vendo.vendoId = :vendoId', {
        vendoId,
      })
      .getOne();

    if (!vendo || vendo.notifications.length > 0) {
      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueExpiredEmail',
        vendoId,
        notificationIds: vendo?.notifications.map(
          (notification) => notification.notificationId,
        ),
        message: 'Skip sending expired email',
      });

      return;
    }

    const emailList: {
      userId: number;
      name: string;
      email: string;
    }[] = [];
    const batchList: {
      userId: number;
      name: string;
      email: string;
    }[] = [];

    for (const vendoUser of vendo.vendosUsers) {
      // filter out external users if the vendo is created internally
      if (!vendo.isExternal && vendoUser.user.isExternal) {
        continue;
      }

      const vacationRule = await manager.findOne(OemVacationRule, {
        where: {
          sourceUserId: vendoUser.userId,
          isActive: true,
        },
        relations: ['targetUser'],
      });
      const targetUser = vacationRule?.targetUser || vendoUser.user;

      const notificationPreference = await manager.findOne(
        OemNotificationPreference,
        targetUser.userId,
      );
      if (
        notificationPreference?.changeFrequencyType ===
        OemNotificationFrequencyType.NEVER
      ) {
        continue;
      }

      if (
        !notificationPreference ||
        notificationPreference.changeFrequencyType ===
          OemNotificationFrequencyType.IMMEDIATELY
      ) {
        emailList.push({
          userId: targetUser.userId,
          name: targetUser.fullName,
          email: targetUser.notificationEmail || targetUser.ssoLoginEmail,
        });
      } else {
        batchList.push({
          userId: targetUser.userId,
          name: targetUser.fullName,
          email: targetUser.notificationEmail || targetUser.ssoLoginEmail,
        });
      }
    }
    //TODO: why we do not follow DRY (we have the same functionality and messages in batchEmail, it is annoying to fix something)
    if (emailList.length > 0) {
      const subject = `Vendo ${vendo.vendoName} has been expired`;
      const customerAddress = this._getCustomerAddress(vendo.customer);
      const dynamicTemplateData: EmailDynamicTemplate = {
        logoURL: VENDORI_LOGO_URL,
        CTA: `${APP_ROOT_URL}/vendos/${vendo.vendoId}`,
        subject,
        body: `The expiration date ${vendo.expiresAt} has been reached and the vendo is now expired.<br/><br/> <strong> ${vendo.company.companyName} | ${customerAddress.region} </strong>`,
        companyAddress: VENDORI_COMPANY_ADDRESS,
        emailverify: `This message was sent to your email because you're a user in the Vendori account. To manage future email notifications, click https://demo.vendori.com/manage-alerts or go to your notifications page within the app.`,
        isVendo: false,
      };

      const emailMessage: EmailMessage = {
        subject,
        from: {
          name: 'Vendori',
          email: VENDORI_SUPPORT_EMAIL,
        },
        to: emailList.map((el) => _.omit(el, 'userId')),
        templateId: MAIL_QUOTE_VENDO_CHANGE_TEMPLATE_ID,
        dynamicTemplateData,
      };

      const result = await sendGridEmailWithDynamicTemplate(emailMessage);
      const messageId = result[0].headers['x-message-id'];

      for (const el of emailList) {
        await this.notificationsService.create(
          {
            companyId: vendo.companyId,
            vendoId: vendo.vendoId,
            customerId: vendo.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            messageId,
            metaData: emailMessage,
            notificationType: OemNotificationTypeEnum.VENDO_EXPIRED,
            sentAt: new Date(),
            status: 'requested',
            subject,
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueExpiredEmail',
        emailMessage,
        result,
        message: 'After sending expired email',
      });
    }

    if (batchList.length > 0) {
      for (const el of batchList) {
        await this.notificationsService.create(
          {
            companyId: vendo.companyId,
            vendoId: vendo.vendoId,
            customerId: vendo.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            notificationType: OemNotificationTypeEnum.VENDO_EXPIRED,
            status: 'pending',
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueRejectedEmail',
        vendoId,
        message: 'After queuing expired email',
      });
    }
  }

  async sendOrQueueTransactedEmail(
    vendoId: number,
    manager: EntityManager,
    isIncludeSavedAlertUser = false,
  ) {
    // send to all the approvers and the owner, or the saved alert users
    let vendoQueryBuilder = manager
      .createQueryBuilder(OemVendoEntity, 'vendo')
      .innerJoinAndSelect('vendo.company', 'company')
      .leftJoinAndSelect('vendo.customer', 'customer')
      .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
      .leftJoinAndSelect('customerAddresses.address', 'address');

    if (isIncludeSavedAlertUser) {
      vendoQueryBuilder = vendoQueryBuilder.innerJoinAndSelect(
        'vendo.vendosUsers',
        'vendoUsers',
        `
        vendoUsers.isApprover = FALSE AND
        (vendoUsers.isSavedAlertUser = FALSE OR vendoUsers.approvalStatus = :approvalStatus)
        `,
        {
          approvalStatus: VendoStatusEnum.TRANSACTED,
        },
      );
    } else {
      vendoQueryBuilder = vendoQueryBuilder.innerJoinAndSelect(
        'vendo.vendosUsers',
        'vendoUsers',
        `vendoUsers.isApprover = FALSE AND vendoUsers.isSavedAlertUser = FALSE`,
      );
    }

    const vendo = await vendoQueryBuilder
      .innerJoinAndSelect('vendoUsers.user', 'user', 'user.isActive = TRUE')
      .innerJoinAndSelect(
        'vendo.vendoApprovalQueues',
        'vendoApprovalQueues',
        `vendoApprovalQueues.isActive = TRUE
          AND vendoApprovalQueues.status = :approvedStatus
          AND vendoApprovalQueues.targetType = :customerTargetType`,
        {
          approvedStatus: VendoApprovalQueueStatusEnum.APPROVED,
          customerTargetType: VendoApprovalQueueTargetTypeEnum.CUSTOMER,
        },
      )
      .leftJoinAndSelect(
        'vendo.notifications',
        'notifications',
        `notifications.notificationType = :notificationType
          AND notifications.isEnabled = TRUE
          AND notifications.receiverId = vendoUsers.userId`,
        { notificationType: OemNotificationTypeEnum.VENDO_TRANSACTED },
      )
      .where('vendo.vendoId = :vendoId', {
        vendoId,
      })
      .getOne();

    if (!vendo || vendo.notifications.length > 0) {
      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueTransactedEmail',
        vendoId,
        notificationIds: vendo?.notifications.map(
          (notification) => notification.notificationId,
        ),
        message: 'Skip sending transacted email',
      });

      return;
    }

    const emailList: {
      userId: number;
      name: string;
      email: string;
    }[] = [];
    const batchList: {
      userId: number;
      name: string;
      email: string;
    }[] = [];

    for (const vendoUser of vendo.vendosUsers) {
      const vacationRule = await manager.findOne(OemVacationRule, {
        where: {
          sourceUserId: vendoUser.userId,
          isActive: true,
        },
        relations: ['targetUser'],
      });
      const targetUser = vacationRule?.targetUser || vendoUser.user;

      const notificationPreference = await manager.findOne(
        OemNotificationPreference,
        targetUser.userId,
      );
      if (
        notificationPreference?.transactionFrequencyType ===
        OemNotificationFrequencyType.NEVER
      ) {
        continue;
      }

      if (
        !notificationPreference ||
        notificationPreference.transactionFrequencyType ===
          OemNotificationFrequencyType.IMMEDIATELY
      ) {
        emailList.push({
          userId: targetUser.userId,
          name: targetUser.fullName,
          email: targetUser.notificationEmail || targetUser.ssoLoginEmail,
        });
      } else {
        batchList.push({
          userId: targetUser.userId,
          name: targetUser.fullName,
          email: targetUser.notificationEmail || targetUser.ssoLoginEmail,
        });
      }
    }

    if (emailList.length > 0) {
      const subject = `Congratulations!<br>${vendo.customer.customerName} has accepted your vendo!`;

      const transactedDateMoment = moment.utc(
        vendo.vendoApprovalQueues[0].updatedAt,
      );
      const transactedTime = transactedDateMoment.format('HH:mm A');
      const transactedDate = transactedDateMoment.format('MM/DD/YYYY');
      const customerAddress = this._getCustomerAddress(vendo.customer);
      const dynamicTemplateData: EmailDynamicTemplate = {
        logoURL: vendo.customer?.logoUrl,
        CTA: `${APP_ROOT_URL}/vendos/${vendo.vendoId}`,
        subject,
        body: `At ${transactedTime} on ${transactedDate}, ${vendo.customer.customerName} accepted Vendo ${vendo.vendoName}.<br/><br/> <strong> ${vendo.customer.customerName} | ${customerAddress.region} </strong>`,
        companyAddress: VENDORI_COMPANY_ADDRESS,
        emailverify: `This message was sent to your email because you're a user in the Vendori account. To manage future email notifications, click https://demo.vendori.com/manage-alerts or go to your notifications page within the app.`,
        isVendo: false,
      };

      const emailMessage: EmailMessage = {
        subject: subject.replace('<br>', ' '),
        from: {
          name: 'Vendori',
          email: VENDORI_SUPPORT_EMAIL,
        },
        to: emailList.map((el) => _.omit(el, 'userId')),
        templateId: MAIL_QUOTE_VENDO_CHANGE_TEMPLATE_ID,
        dynamicTemplateData,
      };

      const result = await sendGridEmailWithDynamicTemplate(emailMessage);
      const messageId = result[0].headers['x-message-id'];

      for (const el of emailList) {
        await this.notificationsService.create(
          {
            companyId: vendo.companyId,
            vendoId: vendo.vendoId,
            customerId: vendo.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            messageId,
            metaData: emailMessage,
            notificationType: OemNotificationTypeEnum.VENDO_TRANSACTED,
            sentAt: new Date(),
            status: 'requested',
            subject,
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueTransactedEmail',
        emailMessage,
        result,
        message: 'After sending transacted email',
      });
    }

    if (batchList.length > 0) {
      for (const el of batchList) {
        await this.notificationsService.create(
          {
            companyId: vendo.companyId,
            vendoId: vendo.vendoId,
            customerId: vendo.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            notificationType: OemNotificationTypeEnum.VENDO_TRANSACTED,
            status: 'pending',
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemVendoApprovalQueuesService/sendOrQueueTransactedEmail',
        vendoId: vendo.vendoId,
        message: 'After queuing transacted email',
      });
    }
  }

  async isAllQueuesApproved(
    vendoId: number,
    isCustomer = false,
    manager: EntityManager,
  ) {
    const activeVendoApprovalQueues = await manager.find(
      OemVendoApprovalQueue,
      {
        where: {
          vendoId,
          isActive: true,
          isEnabled: true,
          targetType: isCustomer
            ? VendoApprovalQueueTargetTypeEnum.CUSTOMER
            : Not(VendoApprovalQueueTargetTypeEnum.CUSTOMER),
        },
      },
    );

    const approvedQueues = activeVendoApprovalQueues.filter(
      (vendoApprovalQueue) =>
        vendoApprovalQueue.status === VendoApprovalQueueStatusEnum.APPROVED,
    );

    return (
      approvedQueues.length > 0 &&
      approvedQueues.length === activeVendoApprovalQueues.length
    );
  }
}
