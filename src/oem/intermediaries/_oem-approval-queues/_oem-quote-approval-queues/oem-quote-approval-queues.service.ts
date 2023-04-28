import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Connection, EntityManager, Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Job } from 'bull';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import * as Dinero from 'dinero.js';
import {
  APP_ROOT_URL,
  MAIL_CUSTOMER_UPDATE_TEMPLATE_ID,
  MAIL_QUOTE_CONFIRMATION_PATH,
  MAIL_QUOTE_VENDO_CHANGE_TEMPLATE_ID,
  VENDORI_COMPANY_ADDRESS,
  VENDORI_LOGO_URL,
  VENDORI_SUPPORT_EMAIL,
} from '../../../../environments';

import { OemQuoteApprovalQueue } from './oem-quote-approval-queue.entity';
import { OemQuoteApprovalQueueCreateDto } from './oem-quote-approval-queue.dto/oem-quote-approval-queue.create.dto';
import { OemQuoteApprovalQueueUpdateDto } from './oem-quote-approval-queue.dto/oem-quote-approval-queue.update.dto';
import { OemUserEntity } from '../../../main/oem-users/oem-user.entity';
import { OemApprovalQueuePriority } from '../../../main/oem-approval-queue-priorities/oem-approval-queue-priority.entity';
import { QuoteApprovalQueueStatusEnum } from './oem-quote-approval-queue.enums/quote-approval-queue-status.enum';
import { QuoteApprovalQueueTargetTypeEnum } from './oem-quote-approval-queue.enums/quote-approval-queue-target-type.enum';
import { OemQuoteEntity } from '../../../main/oem-quotes/oem-quote.entity';
import { QuoteStatusEnum } from '../../../main/oem-quotes/oem-quote.enums/quote-status.enum';
import { OemQuotesUsers } from '../../_oem-quotes-users/oem-quotes-users.entity';
import { sendGridEmailWithDynamicTemplate } from '../../../../shared/email';
import {
  EmailDynamicTemplate,
  EmailMessage,
} from '../../../../shared/email/email.type';
import { OemNotification } from '../../../main/oem-notifications/oem-notification.entity';
import { OemNotificationsService } from '../../../main/oem-notifications/oem-notifications.service';
import { OemNotificationTypeEnum } from '../../../main/oem-notifications/oem-notification.enums/oem-notification.notification-type.enum';
import { OemVacationRule } from '../../../main/oem-rules/oem-vacation-rules/oem-vacation-rule.entity';
import { OemCustomerEntity } from '../../../main/oem-customers/oem-customer.entity';
import { OemNotificationPreference } from '../../../main/oem-notification-preferences/oem-notification-preference.entity';
import { OemNotificationFrequencyType } from '../../../main/oem-notification-preferences/oem-notification-preference.enums/oem-notification-preference.frequency-type.enum';
import { ActionLogs } from '../../../main/oem-action-logs/oem-action-logs.decorators/action-logs.decorator';
import { ActionLogTypeEnum } from '../../../main/oem-action-logs/oem-action-log.enums/action-log-types.enum';
import { ActionsEnum } from '../../../main/oem-action-logs/oem-action-log.enums/actions.enum';
import { AuthService } from '../../../../auth/auth.service';
import { newDineroDollars } from '../../../../shared/dinero';
import { RoleAbilityFactory } from '../../../../auth/roles/role-ability.factory';
import { RoleActions } from '../../../../auth/roles/types/role-actions.enum';
import { RoleSubjects } from '../../../../auth/roles/types/role-subjects.type';
import { FunctionTypeEnum } from '../../../main/oem-roles/oem-role.enums/function-type.enum';
import { AddressTypeEnum } from '../../../main/oem-addresses/oem-address.enums/address-type.enum';
import { RoleTypeEnum } from '../../../main/oem-roles/oem-role.enums/role-type.enum';
import { CommonDefaultMethodExtension } from '../../../../common/decorators/common-default-method-extention.decorator';

//TODO: NEED TO FULLY REFACTOR THIS SERVICE!!!

/**
 * TODO: for action logs, we need to have separated methods for submit, reject, transact, approve
 * ** already DONE
 */

// TODO (REFACTORING): for sending create notification queue we might use typeorm hook
// TODO: I think we need to have an abstract class for approval queue bc we use a lot of duplication for quote and vendo approvals
@Injectable()
@CommonDefaultMethodExtension
export class OemQuoteApprovalQueuesService extends TypeOrmCrudService<OemQuoteApprovalQueue> {
  //private readonly logger = new Logger(OemQuoteApprovalQueuesService.name);

  constructor(
    private connection: Connection,
    @Inject(Logger)
    private readonly logger: Logger,
    @InjectRepository(OemQuoteApprovalQueue)
    public repo: Repository<OemQuoteApprovalQueue>,
    private jwtService: JwtService,
    private notificationsService: OemNotificationsService,
    private authService: AuthService,
    private roleAbilityFactory: RoleAbilityFactory,
  ) {
    super(repo);
    this.logger = new Logger(OemQuoteApprovalQueuesService.name);
  }

  getToken(
    quoteApprovalQueueId: number,
    expiresAt: Date | string,
    now: moment.Moment = moment.utc(),
  ) {
    const expirationDays = moment.utc(expiresAt).diff(now, 'days');
    const token = this.jwtService.sign(
      {
        type: 'quote_approval_queue',
        id: quoteApprovalQueueId,
      },
      {
        expiresIn: `${expirationDays}d`,
      },
    );

    return token;
  }

  async create(
    dto: Partial<OemQuoteApprovalQueueCreateDto>,
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

    const quoteApprovalQueue = await manager.save(
      this.repo.create({
        ...dto,
        approvalQueuePriorityId: approvalQueuePriority?.approvalQueuePriorityId,
        expiresAt,
      }),
    );

    quoteApprovalQueue.token = await this.getToken(
      quoteApprovalQueue.quoteApprovalQueueId,
      expiresAt,
      now,
    );

    return manager.save(quoteApprovalQueue);
  }

  async rejectedHandler(
    req,
    currentQuoteApprovalQueue: OemQuoteApprovalQueue,
    manager: EntityManager,
  ) {
    // manager is already in the transaction entity manager in the same cycle of updateOne
    await manager.update(
      OemQuoteApprovalQueue,
      {
        quoteId: currentQuoteApprovalQueue.quoteId,
        quoteApprovalQueueId: Not(
          currentQuoteApprovalQueue.quoteApprovalQueueId,
        ),
        isEnabled: true,
      },
      {
        isActive: false,
      },
    );

    const updatedQuote = await manager.update(
      OemQuoteEntity,
      currentQuoteApprovalQueue.quoteId,
      {
        quoteStatus: QuoteStatusEnum.REJECTED,
        isLocked: true,
      },
    );

    this.rejectEvent(req, updatedQuote);
    await this.sendOrQueueRejectedEmail(
      currentQuoteApprovalQueue.quoteId,
      currentQuoteApprovalQueue,
      manager,
    );

    return {
      id: currentQuoteApprovalQueue.quoteId,
      user: {
        userId: currentQuoteApprovalQueue.userId,
        companyId: currentQuoteApprovalQueue.companyId,
      },
      status: QuoteStatusEnum.REJECTED,
    };
  }

  //only for action logs
  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.APPROVE)
  async approveEvent(req, updatedQuote) {
    return updatedQuote;
  }

  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.TRANSACT)
  async transactEvent(req, updatedQuote) {
    return updatedQuote;
  }

  @ActionLogs(ActionLogTypeEnum.QUOTE, ActionsEnum.REJECT)
  async rejectEvent(req, updatedQuote) {
    return updatedQuote;
  }

  async transactedHandler(
    req: CrudRequest | { user: OemUserEntity },
    quoteId: number,
    manager: EntityManager,
  ) {
    await manager.update(OemQuoteEntity, quoteId, {
      quoteStatus: QuoteStatusEnum.TRANSACTED,
      isLocked: true,
    });

    const updatedQuote = await manager.findOne(OemQuoteEntity, quoteId);

    this.transactEvent(req, updatedQuote);
    await this.sendOrQueueTransactedEmail(quoteId, manager, true);
  }

  async approvedHandler(
    req: CrudRequest | { user: OemUserEntity },
    currentQuoteApprovalQueue: OemQuoteApprovalQueue,
    manager: EntityManager,
  ) {
    const { quoteId } = currentQuoteApprovalQueue;
    const quote = await manager.findOne(OemQuoteEntity, quoteId);
    const { quoteStatus } = quote;

    const isInternallyApproved = await this._isAllQueuesApproved(
      quoteId,
      false,
      manager,
    );
    const isCustomerApproved = await this._isAllQueuesApproved(
      quoteId,
      true,
      manager,
    );

    console.log({ isInternallyApproved, isCustomerApproved });

    if (
      (isInternallyApproved ||
        [
          QuoteStatusEnum.APPROVED,
          QuoteStatusEnum.AUTO_APPROVED,
          QuoteStatusEnum.SENT_EXTERNALLY,
        ].includes(quoteStatus)) &&
      isCustomerApproved
    ) {
      await this.transactedHandler(req, quoteId, manager);
    } else if (
      quoteStatus === QuoteStatusEnum.PENDING_INTERNAL_APPROVAL &&
      isInternallyApproved
    ) {
      await manager.update(OemQuoteEntity, quoteId, {
        quoteStatus: QuoteStatusEnum.APPROVED,
        isLocked: true,
      });

      const updatedQuote = await manager.findOne(OemQuoteEntity, {
        quoteId: quoteId,
      });
      await this.approveEvent(req, updatedQuote);
      await this.sendOrQueueApprovedEmailToOwnerAndSavedAlertUsers(
        quoteId,
        manager,
      );
    }
  }

  // Checks if user is able to approve or reject quote
  async validate(
    req,
    quoteApprovalQueueId: number,
    dto: Partial<OemQuoteApprovalQueueUpdateDto>,
    manager: EntityManager,
  ) {
    // TODO: currently it seems we are allowing any authenticated user to approve any queue regardless their roles
    // I think we have to allow users only with the same role to approve the queue
    const allowedStatuses = [
      QuoteApprovalQueueStatusEnum.APPROVED,
      QuoteApprovalQueueStatusEnum.REJECTED,
    ];
    if (dto && dto.status && !allowedStatuses.includes(dto.status)) {
      throw new BadRequestException('Invalid quote approval queue status');
    }

    const quoteApprovalQueue = await manager
      .createQueryBuilder(OemQuoteApprovalQueue, 'quoteApprovalQueue')
      .innerJoin(
        'quoteApprovalQueue.quote',
        'quote',
        'quote.quoteStatus IN (:...quoteStatuses)',
        {
          quoteStatuses: [
            QuoteStatusEnum.PENDING_INTERNAL_APPROVAL,
            QuoteStatusEnum.AUTO_APPROVED,
            QuoteStatusEnum.APPROVED,
            QuoteStatusEnum.SENT_EXTERNALLY,
          ],
        },
      )
      .leftJoinAndSelect(
        'quoteApprovalQueue.approvalQueuePriority',
        'approvalQueuePriority',
      )
      .leftJoin('quoteApprovalQueue.user', 'oemUser')
      .leftJoin('oemUser.role', 'role')
      .where(
        `quoteApprovalQueue.isActive = TRUE
        AND quoteApprovalQueue.quoteApprovalQueueId = :quoteApprovalQueueId
        AND quoteApprovalQueue.status = :quoteApprovalQueueStatus
        AND (quoteApprovalQueue.approvalQueuePriorityId IS NULL OR approvalQueuePriority.isActive = TRUE)
        AND (quoteApprovalQueue.userId IS NULL OR (oemUser.isActive = TRUE AND role.isActive = TRUE))`,
        // AND role.roleId = :roleId
        //AND quoteApprovalQueue.userId = :userId,
        {
          //userId: req.user.userId,
          //roleId: req.user.roleId,
          quoteApprovalQueueId,
          quoteApprovalQueueStatus: QuoteApprovalQueueStatusEnum.PENDING,
        },
      )
      .getOne();

    console.debug('Finding quoteApprovalQueue', quoteApprovalQueue);

    if (!quoteApprovalQueue) {
      throw new NotFoundException('No pending quote approval queue found');
    }

    const quoteApprovalQueueInTurn = await this.connection.manager
      .createQueryBuilder(OemQuoteApprovalQueue, 'quoteApprovalQueue')
      .leftJoinAndSelect(
        'quoteApprovalQueue.approvalQueuePriority',
        'approvalQueuePriority',
      )
      .leftJoin('quoteApprovalQueue.user', 'oemUser')
      .leftJoin('oemUser.role', 'role')
      .where(
        `quoteApprovalQueue.isActive = TRUE
        AND quoteApprovalQueue.quoteId = :quoteId
        AND quoteApprovalQueue.status = :quoteApprovalQueueStatus
        AND (quoteApprovalQueue.approvalQueuePriorityId IS NULL OR approvalQueuePriority.isActive = TRUE)
        AND (quoteApprovalQueue.userId IS NULL OR (oemUser.isActive = TRUE AND role.isActive = TRUE))`,
        {
          quoteId: quoteApprovalQueue.quoteId,
          quoteApprovalQueueStatus: QuoteApprovalQueueStatusEnum.PENDING,
        },
      )
      .orderBy('approvalQueuePriority.priority', 'ASC', 'NULLS LAST')
      .getOne();

    /*console.debug('Finding quoteApprovaInTurnlQueue', await this.connection.manager
      .createQueryBuilder(OemQuoteApprovalQueue, 'quoteApprovalQueue')
      .leftJoinAndSelect(
        'quoteApprovalQueue.approvalQueuePriority',
        'approvalQueuePriority',
      )
      .leftJoin('quoteApprovalQueue.user', 'oemUser')
      .leftJoin('oemUser.role', 'role')
      .where(
        `quoteApprovalQueue.isActive = TRUE
        AND quoteApprovalQueue.quoteId = :quoteId
        AND quoteApprovalQueue.status = :quoteApprovalQueueStatus
        AND (quoteApprovalQueue.approvalQueuePriorityId IS NULL OR approvalQueuePriority.isActive = TRUE)
        AND (quoteApprovalQueue.userId IS NULL OR (oemUser.isActive = TRUE AND role.isActive = TRUE))`,
        {
          quoteId: quoteApprovalQueue.quoteId,
          quoteApprovalQueueStatus: QuoteApprovalQueueStatusEnum.PENDING,
        },
      )
      .orderBy('approvalQueuePriority.priority', 'ASC', 'NULLS LAST').getMany());
*/
    if (
      quoteApprovalQueue.approvalQueuePriority?.priority !==
      quoteApprovalQueueInTurn?.approvalQueuePriority?.priority
    ) {
      throw new BadRequestException(`It\'s not your approval turn`);
    }

    return quoteApprovalQueue;
  }

  private async _isExpired(expAt) {
    const now = moment.utc();
    const expiresAt = expAt || now.clone().add(1, 'month').toDate();
    return moment.utc(expiresAt).isBefore(now);
  }

  async update(
    req: CrudRequest & { user: OemUserEntity },
    quoteApprovalQueueId: number,
    dto: Partial<
      OemQuoteApprovalQueueUpdateDto & {
        targetType: QuoteApprovalQueueTargetTypeEnum;
      }
    >,
    manager: EntityManager,
  ) {
    console.debug('Updating OemQuoteApprovalQueue');
    //TODO: this is a temporary solution, I see that role factory implemented only partially,
    // so we might need to move admin check and validation to separated decorator which can modify a functionality of current method depending on roles
    // 26.01.23 Client wants admin can approve all steps by once, mostly for demo

    const isAdmin = req.user.role.roleType == RoleTypeEnum.ADMIN;
    let quoteApprovalQueue;
    if (isAdmin) {
      quoteApprovalQueue = await manager.findOne(OemQuoteApprovalQueue, {
        where: {
          quoteApprovalQueueId,
          isActive: true,
        },
      });
    } else {
      quoteApprovalQueue = await this.validate(
        req,
        quoteApprovalQueueId,
        dto,
        manager,
      );
    }

    if (!quoteApprovalQueue) {
      throw new BadRequestException('No active approval queue found');
    }

    let updatedToken = undefined;
    let status = dto.status || quoteApprovalQueue.status;
    const expiresAt =
      (dto.expiresAt && new Date(dto.expiresAt)) ||
      quoteApprovalQueue.expiresAt;

    const isRejected =
      quoteApprovalQueue.status !== dto.status &&
      dto.status === QuoteApprovalQueueStatusEnum.REJECTED;

    const isApproved =
      quoteApprovalQueue.status !== dto.status &&
      dto.status === QuoteApprovalQueueStatusEnum.APPROVED; // TODO: we use the same name for transact quote - but I think need to use Transact

    const isExpired = await this._isExpired(expiresAt);

    // do not update an expired quote
    if (isExpired) {
      status = QuoteApprovalQueueStatusEnum.EXPIRED;
    } else {
      if (dto.expiresAt !== undefined) {
        updatedToken = this.getToken(
          quoteApprovalQueue.quoteApprovalQueueId,
          expiresAt,
          moment.utc(),
        );
      }
    }

    const updatedQuoteApprovalQueue = await manager.save(
      this.repo.create({
        ..._.omit(quoteApprovalQueue, 'approvalQueuePriority'),
        ...dto,
        status,
        token: updatedToken,
      }),
    );

    //update with the same priority
    await manager.update(
      OemQuoteApprovalQueue,
      {
        isEnabled: true,
        approvalQueuePriorityId: quoteApprovalQueue.approvalQueuePriorityId,
        targetType: quoteApprovalQueue.targetType,
        quoteId: quoteApprovalQueue.quoteId,
      },
      { status: dto.status },
    );

    //we should also update all steps if user has admin ROLE
    if (isAdmin) {
      await manager.update(
        OemQuoteApprovalQueue,
        {
          isEnabled: true,
          targetType: quoteApprovalQueue.targetType,
          quoteId: quoteApprovalQueue.quoteId,
        },
        { status: dto.status },
      );
    }
    console.log('Checking status quote', { isExpired, isRejected, isApproved });
    if (isExpired) {
      return updatedQuoteApprovalQueue;
    } else if (isRejected) {
      await this.rejectedHandler(req, updatedQuoteApprovalQueue, manager);
    } else if (isApproved) {
      await this.approvedHandler(req, updatedQuoteApprovalQueue, manager);
    }

    return updatedQuoteApprovalQueue;
  }

  async updateOne(
    req: CrudRequest & { user: OemUserEntity },
    dto: Partial<OemQuoteApprovalQueueUpdateDto>,
  ): Promise<OemQuoteApprovalQueue> {
    return this.connection.transaction(async (manager) => {
      const id = req.parsed.paramsFilter.find(
        (params) => params.field === req.options.params.id.field,
      );
      return this.update(req, id.value, dto, manager);
    });
  }

  private async _disableApprovalNotificationQueues(
    quoteId: number,
    manager: EntityManager,
  ) {
    // disable all notification queues
    try {
      await manager.update(
        OemNotification,
        {
          isEnabled: true,
          quoteId: quoteId,
        },
        { isEnabled: false },
      );
    } catch (e) {
      this.logger.error({
        func: 'OemQuoteApprovalQueuesService/_disableApprovalNotificationQueues',
        quoteId: quoteId,
        error: e,
        message: e.message,
      });
      throw new Error('Cannot disable notification queues');
    }
  }

  async deactivateQuoteApprovalQueues(quoteId: number, manager: EntityManager) {
    // deactivate the all quote approval queue
    try {
      await manager.update(
        OemQuoteApprovalQueue,
        {
          isEnabled: true,
          quoteId: quoteId,
        },
        { isActive: false, isEnabled: false },
      );
    } catch (e) {
      this.logger.error({
        func: 'OemQuoteApprovalQueuesService/_deactivateQuoteApprovalQueue',
        quoteId: quoteId,
        error: e,
        message: e.message,
      });
      throw new Error('Cannot deactivate approval queues');
    }
  }

  /**
   *
   * @param data
   * @param targetTypes - [INTERNAL, EXTERNAL, CUSTOMER]
   * @param manager
   * @private
   * @description Create approval queue. *CUSTOMER - this is eApprover - the person who can make quote transacted.
   */
  private async _createQuoteApprovalQueues(
    data: { quoteId: number; externalUsers?: Array<OemUserEntity> },
    targetTypes: Array<QuoteApprovalQueueTargetTypeEnum>,
    manager: EntityManager,
  ) {
    // create new quote approval queues
    const quoteUsers = await manager.find(OemQuotesUsers, {
      where: {
        quoteId: data.quoteId,
        isEnabled: true,
      },
      relations: ['user', 'user.role'],
    });

    for (const quoteUser of quoteUsers) {
      // check if external user allowed to be added to queue
      const targetType = quoteUser.isApprover
        ? QuoteApprovalQueueTargetTypeEnum.CUSTOMER
        : quoteUser.user?.isExternal
        ? QuoteApprovalQueueTargetTypeEnum.EXTERNAL
        : QuoteApprovalQueueTargetTypeEnum.INTERNAL;

      console.debug(
        'Checking targetType for quote-approving',
        { quoteUser, role: quoteUser.user.role },
        { targetType },
      );

      // Check the admin role when sending internally
      /* if (quoteUser.user.role?.roleType !== FunctionTypeEnum.ADMIN) {*/ //--- we do not use FunctionType in our system
      if (quoteUser.user.role?.roleType !== RoleTypeEnum.ADMIN) {
        if (quoteUser.isOwner) continue;

        // Skip if it's just a saved alert user who wants to get a notification
        if (
          quoteUser.isSavedAlertUser &&
          !quoteUser.isApprover &&
          !quoteUser.isWorkflowUser
        ) {
          continue;
        }

        // Check if internal user allowed to be added to queue
        if (
          !quoteUser.isApprover &&
          quoteUser.user?.isExternal === false &&
          !targetTypes.includes(QuoteApprovalQueueTargetTypeEnum.INTERNAL)
        )
          continue;

        // Check if selected user allowed to be added to queue
        if (
          targetType !== QuoteApprovalQueueTargetTypeEnum.INTERNAL &&
          data.externalUsers?.length &&
          !data.externalUsers.find(
            (user) => user.userId === quoteUser.user?.userId,
          )
        ) {
          continue;
        }

        // Check if the user role is allowed for approval
        const ability = await this.roleAbilityFactory.createForUser(
          quoteUser.user,
        );
        console.debug(
          'Ability Role',
          ability.cannot(RoleActions.Modify, RoleSubjects.QuoteApprovalQueue),
        );
        if (
          ability.cannot(RoleActions.Modify, RoleSubjects.QuoteApprovalQueue)
        ) {
          continue;
        }
      }

      if (
        !quoteUser.isApprover &&
        quoteUser.user?.isExternal &&
        !targetTypes.includes(QuoteApprovalQueueTargetTypeEnum.EXTERNAL)
      )
        continue;
      // Check if eApprover user allowed to be added to queue
      if (
        quoteUser.isApprover &&
        !targetTypes.includes(QuoteApprovalQueueTargetTypeEnum.CUSTOMER)
      ) {
        continue;
      }

      // Check if eApprover user allowed to be added to queue
      if (
        !quoteUser.user?.isExternal &&
        (targetTypes.includes(QuoteApprovalQueueTargetTypeEnum.CUSTOMER) ||
          targetTypes.includes(QuoteApprovalQueueTargetTypeEnum.EXTERNAL))
      ) {
        continue;
      }

      await this.create(
        {
          companyId: quoteUser.companyId,
          quoteId: quoteUser.quoteId,
          userId: quoteUser.userId,
          targetType,
        },
        manager,
      );
    }
  }

  /**
   * if quote was already approved and we call resubmit - it disables notifications and resend it again
   */
  async quoteResubmitHandler(
    req: Partial<
      CrudRequest & {
        user: OemUserEntity;
        externalUsers?: Array<OemUserEntity>;
      }
    >,
    updatedQuote: OemQuoteEntity,
    manager: EntityManager,
  ) {
    const { quoteStatus: updatedStatus } = updatedQuote;

    const isPending =
      updatedStatus === QuoteStatusEnum.PENDING_INTERNAL_APPROVAL;
    const isAutoApproved = updatedStatus === QuoteStatusEnum.AUTO_APPROVED;
    const isApproved = updatedStatus === QuoteStatusEnum.APPROVED;
    const isPendingCustomerAcceptance =
      updatedStatus === QuoteStatusEnum.SENT_EXTERNALLY;
    const isTransacted = updatedStatus === QuoteStatusEnum.TRANSACTED;

    // we need disabled approval queues and notification queues to be able reset it
    if (
      isPending ||
      isAutoApproved ||
      isApproved ||
      isPendingCustomerAcceptance
    ) {
      await this.deactivateQuoteApprovalQueues(updatedQuote.quoteId, manager);
      await this._disableApprovalNotificationQueues(
        updatedQuote.quoteId,
        manager,
      );
    }
    // create internal approval queues
    if (isPending) {
      await this._createQuoteApprovalQueues(
        { quoteId: updatedQuote.quoteId },
        [QuoteApprovalQueueTargetTypeEnum.INTERNAL],
        manager,
      );
    }
    // create external and customer(eApprover) queues (but at the moment only eApprover can confirm a quote)
    // TODO:
    // - We don't need to pass externalUserIds from frontend. Instead we could just create approval queues for external users based on quotes_users table.
    // - Because only one external user could be eApprover,
    // we could just create an approval queue for eApprover only and pass quoteId to the frontend instead of quoteApprovalQueueId
    // so that frontend could get the current user's approval queue by calling the backend endpoint with quoteId.
    // That way we could create an approval queue only for eApprover instead of creating them for all external users unnecessarily.
    if (isAutoApproved || isApproved || isPendingCustomerAcceptance) {
      // this.logger.debug({
      //   func: 'OemQuoteApprovalQueuesService/_quoteResubmitHandler',
      //   quoteId: updatedQuote.quoteId,
      //   externalUsers: req.externalUsers,
      //   message: 'Call _createQuoteApprovalQueues',
      // });

      await this._createQuoteApprovalQueues(
        {
          quoteId: updatedQuote.quoteId,
          externalUsers: req.externalUsers,
        },
        [
          QuoteApprovalQueueTargetTypeEnum.EXTERNAL,
          QuoteApprovalQueueTargetTypeEnum.CUSTOMER,
        ],
        manager,
      );

      // send emails or put them to sending queues (there is notification option)
      this.logger.debug({
        func: 'OemQuoteApprovalQueuesService/_quoteResubmitHandler',
        quoteId: updatedQuote.quoteId,
        externalUsers: req.externalUsers,
        message: 'Call sendOrQueueApprovedEmail',
      });
      await this.sendOrQueueApprovedEmail(
        { quote: updatedQuote, externalUsers: req.externalUsers },
        manager,
      );

      if (isAutoApproved) {
        await this.sendOrQueueApprovedEmailToOwnerAndSavedAlertUsers(
          updatedQuote.quoteId,
          manager,
        );
      }
    } else if (isTransacted) {
      await this.sendOrQueueTransactedEmail(
        updatedQuote.quoteId,
        manager,
        false,
      );
    } else if (isPending) {
      await this.sendOrQueueSubmittedEmail(updatedQuote.quoteId, manager);
    }
  }

  // sending email where user can approve quote
  async sendOrQueueApprovalEmail(
    job: Job,
    quote: OemQuoteEntity,
    manager: EntityManager,
  ) {
    if (quote.quoteStatus !== QuoteStatusEnum.PENDING_INTERNAL_APPROVAL) {
      return;
    }

    const quoteApprovalQueue = await manager
      .createQueryBuilder(OemQuoteApprovalQueue, 'quoteApprovalQueue')
      .innerJoinAndSelect('quoteApprovalQueue.company', 'company')
      .innerJoin(
        'quoteApprovalQueue.approvalQueuePriority',
        'approvalQueuePriority',
        'approvalQueuePriority.isActive = TRUE',
      )
      .innerJoinAndSelect(
        'quoteApprovalQueue.user',
        'oemUser',
        'oemUser.isActive = TRUE',
      )
      .innerJoinAndSelect('oemUser.role', 'role', 'role.isActive = TRUE')
      .leftJoinAndSelect(
        'quoteApprovalQueue.notifications',
        'notifications',
        `notifications.notificationType = :notificationType AND notifications.isEnabled = TRUE`,
        { notificationType: OemNotificationTypeEnum.QUOTE_SUBMITTED },
      )
      .where(
        `quoteApprovalQueue.isActive = TRUE
        AND quoteApprovalQueue.quoteId = :quoteId
        AND quoteApprovalQueue.companyId = :companyId
        AND quoteApprovalQueue.status = :quoteApprovalQueueStatus
        AND quoteApprovalQueue.targetType != :customerTargetType`,
        {
          quoteId: quote.quoteId,
          companyId: quote.companyId,
          quoteApprovalQueueStatus: QuoteApprovalQueueStatusEnum.PENDING,
          customerTargetType: QuoteApprovalQueueTargetTypeEnum.CUSTOMER,
        },
      )
      .orderBy('approvalQueuePriority.priority')
      .getOne();

    const jobQuoteId: any = { existingNotifications: 0 };
    jobQuoteId[`quote${quote.quoteId}`] = {
      existingNotifications: quoteApprovalQueue?.notifications?.length,
    };
    job.update(jobQuoteId);

    if (!quoteApprovalQueue || quoteApprovalQueue.notifications.length > 0) {
      return;
    }

    const ownerQuoteUser = await manager
      .createQueryBuilder(OemQuotesUsers, 'quoteUser')
      .innerJoinAndSelect('quoteUser.user', 'user')
      .where('quoteUser.quoteId = :quoteId AND quoteUser.isOwner = TRUE', {
        quoteId: quote.quoteId,
      })
      .getOne();

    if (!ownerQuoteUser) return;

    const vacationRule = await manager.findOne(OemVacationRule, {
      where: {
        sourceUserId: quoteApprovalQueue.userId,
        isActive: true,
      },
      relations: ['targetUser'],
    });
    const targetUser = vacationRule?.targetUser || quoteApprovalQueue.user;

    const notificationPreference = await manager.findOne(
      OemNotificationPreference,
      targetUser.userId,
    );
    if (
      notificationPreference?.submissionFrequencyType ===
      OemNotificationFrequencyType.NEVER
    ) {
      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueApprovalEmail',
        quoteId: quote.quoteId,
        quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
        message:
          'Skip sending an approval email due to the notification preference',
      });

      return;
    }

    const customer = await manager.findOne(OemCustomerEntity, {
      where: { customerId: quote.customerId },
    });

    const subject = `Quote ${quote.quoteName} is ready for review`;
    const email = targetUser.notificationEmail || targetUser.ssoLoginEmail;
    const netAmount = newDineroDollars(
      quote.netAmount,
      quote.currency as Dinero.Currency,
    ).toFormat('$0,0.00');

    const dynamicTemplateData: EmailDynamicTemplate = {
      logoURL: VENDORI_LOGO_URL,
      CTA: `${APP_ROOT_URL}/quotes/${quote.quoteId}`,
      subject,
      body: `
        ${ownerQuoteUser.user.fullName} has submitted a quote that requires your approval.<br/><br/>
        <strong> ${customer?.customerName} | ${netAmount} | ${quote.quoteUuid} </strong> <br/><br/>
        Please click below to review the quote and approve or deny it.
      `.replace(/\s+/g, ' '),
      companyAddress: VENDORI_COMPANY_ADDRESS,
      emailverify: `
        This message was sent to ${email} because you're a user in the ${quoteApprovalQueue.user.fullName} Vendori account.
        To manage future email notifications, click <a href="https://demo.vendori.com/manage-alerts">here</a> or go to your notifications page within the app.
      `.replace(/\s+/g, ' '),
      isVendo: false,
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
          companyId: quote.companyId,
          quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
          quoteId: quote.quoteId,
          receiverId: targetUser.userId,
          customerId: quote.customerId,
          fromEmail: VENDORI_SUPPORT_EMAIL,
          toEmail: email,
          messageId,
          metaData: emailMessage,
          notificationType: OemNotificationTypeEnum.QUOTE_SUBMITTED,
          status: 'requested',
          sentAt: new Date(),
          subject,
        },
        manager,
      );
      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueApprovalEmail',
        quoteId: quote.quoteId,
        quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
        emailMessage,
        result,
        message: 'After sending an approval email',
      });
    } else {
      await this.notificationsService.create(
        {
          companyId: quote.companyId,
          quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
          quoteId: quote.quoteId,
          receiverId: targetUser.userId,
          customerId: quote.customerId,
          fromEmail: VENDORI_SUPPORT_EMAIL,
          toEmail: email,
          notificationType: OemNotificationTypeEnum.QUOTE_SUBMITTED,
          status: 'pending',
        },
        manager,
      );

      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueApprovalEmail',
        quoteId: quote.quoteId,
        quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
        message: 'After queueing an approval email',
      });
    }
  }

  async sendOrQueueSubmittedEmail(quoteId: number, manager: EntityManager) {
    // send to the owner and saved alert users
    const quote = await manager
      .createQueryBuilder(OemQuoteEntity, 'quote')
      .innerJoinAndSelect('quote.company', 'company')
      .leftJoinAndSelect('quote.customer', 'customer')
      .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
      .leftJoinAndSelect('customerAddresses.address', 'address')
      .innerJoinAndSelect(
        'quote.usersQuotes',
        'quoteUsers',
        `quoteUsers.isOwner = TRUE OR quoteUsers.approvalStatus = :approvalStatus`,
        { approvalStatus: QuoteStatusEnum.PENDING_INTERNAL_APPROVAL },
      )
      .innerJoinAndSelect('quoteUsers.user', 'user', 'user.isActive = TRUE')
      .leftJoinAndSelect(
        'quote.notifications',
        'notifications',
        `notifications.notificationType = :notificationType AND notifications.isEnabled = TRUE`,
        { notificationType: OemNotificationTypeEnum.QUOTE_SUBMITTED },
      )
      .where('quote.quoteId = :quoteId', {
        quoteId,
      })
      .getOne();

    if (!quote || quote.notifications.length > 0) {
      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueSubmittedEmail',
        quoteId,
        notificationIds: quote?.notifications.map(
          (notification) => notification.notificationId,
        ),
        message: 'Skip sending submitted email',
      });

      return;
    }

    const ownerQuoteUser = await manager
      .createQueryBuilder(OemQuotesUsers, 'quoteUser')
      .innerJoinAndSelect('quoteUser.user', 'user')
      .where('quoteUser.quoteId = :quoteId AND quoteUser.isOwner = TRUE', {
        quoteId: quote.quoteId,
      })
      .getOne();

    if (!ownerQuoteUser) {
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

    for (const quoteUser of quote.usersQuotes) {
      const vacationRule = await manager.findOne(OemVacationRule, {
        where: {
          sourceUserId: quoteUser.userId,
        },
        relations: ['targetUser'],
      });
      const targetUser = vacationRule?.targetUser || quoteUser.user;

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
    const subject = `${ownerQuoteUser.user.fullName} has submitted a proposal!`;

    console.log(`ownerQuoteUser`, ownerQuoteUser.user);
    const dynamicTemplateData: EmailDynamicTemplate = {
      logoURL: VENDORI_LOGO_URL,
      CTA: `${APP_ROOT_URL}/quotes/${quote.quoteId}`,
      subject,
      body: `
        To view this proposal, please click below.<br/><br/>
        <strong> ${quote.company.companyName} | ${ownerQuoteUser.user.phone} | ${ownerQuoteUser.user.region} </strong>
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
            companyId: quote.companyId,
            quoteId: quote.quoteId,
            customerId: quote.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            messageId,
            metaData: emailMessage,
            notificationType: OemNotificationTypeEnum.QUOTE_SUBMITTED,
            sentAt: new Date(),
            status: 'requested',
            subject,
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueSubmittedEmail',
        quoteId,
        emailMessage,
        result,
        message: 'After sending submitted email',
      });
    }

    if (batchList.length > 0) {
      for (const el of batchList) {
        await this.notificationsService.create(
          {
            companyId: quote.companyId,
            quoteId: quote.quoteId,
            customerId: quote.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            notificationType: OemNotificationTypeEnum.QUOTE_SUBMITTED,
            status: 'pending',
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueSubmittedEmail',
        quoteId,
        message: 'After queuing submitted email',
      });
    }
  }

  // send an email to eApprover
  async sendOrQueueApprovedEmail(
    data: { quote: OemQuoteEntity; externalUsers: Array<OemUserEntity> },
    manager: EntityManager,
  ) {
    // send to the customer and external users when approved by everyone or auto-approved
    const quoteApprovalQueues = await manager
      .createQueryBuilder(OemQuoteApprovalQueue, 'quoteApprovalQueue')
      .innerJoinAndSelect('quoteApprovalQueue.company', 'company')
      .innerJoinAndSelect('quoteApprovalQueue.quote', 'quote')
      .innerJoinAndSelect(
        'quoteApprovalQueue.user',
        'oemUser',
        'oemUser.isActive = TRUE',
      )
      .innerJoinAndSelect('oemUser.role', 'role', 'role.isActive = TRUE')
      .leftJoinAndSelect(
        'quoteApprovalQueue.notifications',
        'notifications',
        `notifications.notificationType = :notificationType`,
        { notificationType: OemNotificationTypeEnum.QUOTE_APPROVED },
      )
      .where(
        `
          quoteApprovalQueue.isActive = TRUE
          AND quoteApprovalQueue.quoteId = :quoteId
          AND quoteApprovalQueue.companyId = :companyId
          AND quoteApprovalQueue.status = :quoteApprovalQueueStatus
          AND quoteApprovalQueue.targetType IN (:...targetTypes)
        `,
        {
          quoteId: data.quote.quoteId,
          companyId: data.quote.companyId,
          quoteApprovalQueueStatus: QuoteApprovalQueueStatusEnum.PENDING,
          targetTypes: [
            QuoteApprovalQueueTargetTypeEnum.CUSTOMER,
            QuoteApprovalQueueTargetTypeEnum.EXTERNAL,
          ],
        },
      )
      .getMany();

    for (const quoteApprovalQueue of quoteApprovalQueues) {
      this.logger.debug({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueApprovedEmail',
        quoteApprovalQueue: quoteApprovalQueue,
        condition:
          !quoteApprovalQueue || quoteApprovalQueue.notifications.length > 0,
      });
      if (!quoteApprovalQueue || quoteApprovalQueue.notifications.length > 0) {
        this.logger.log({
          func: 'OemQuoteApprovalQueuesService/sendOrQueueApprovedEmail',
          quoteId: data.quote.quoteId,
          quoteApprovalQueueId: quoteApprovalQueue?.quoteApprovalQueueId,
          notificationIds: quoteApprovalQueue?.notifications.map(
            (notification) => notification.notificationId,
          ),
          message: 'Skip sending approved email',
        });

        continue;
      }

      const ownerQuoteUser = await manager
        .createQueryBuilder(OemQuotesUsers, 'quoteUser')
        .innerJoinAndSelect('quoteUser.user', 'user')
        .where('quoteUser.quoteId = :quoteId AND quoteUser.isOwner = TRUE', {
          quoteId: data.quote.quoteId,
        })
        .getOne();

      if (!ownerQuoteUser) {
        this.logger.log({
          func: 'OemQuoteApprovalQueuesService/sendOrQueueApprovedEmail',
          quoteId: data.quote.quoteId,
          userId: quoteApprovalQueue.userId,
          quoteApprovalQueueId: quoteApprovalQueue?.quoteApprovalQueueId,
          notificationIds: quoteApprovalQueue?.notifications.map(
            (notification) => notification.notificationId,
          ),
          message: 'Skip sending approved email, owner user was not found.',
        });
        continue;
      }

      const notificationPreference = await manager.findOne(
        OemNotificationPreference,
        quoteApprovalQueue.userId,
      );
      if (
        notificationPreference?.approvalFrequencyType ===
        OemNotificationFrequencyType.NEVER
      ) {
        this.logger.log({
          func: 'OemQuoteApprovalQueuesService/sendOrQueueApprovedEmail',
          quoteId: data.quote.quoteId,
          userId: quoteApprovalQueue.userId,
          quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
          message:
            'Skip sending an approved email due to the notification preference',
        });

        continue;
      }

      const subject = `${ownerQuoteUser.user.fullName} has sent you a proposal!`;

      const email =
        quoteApprovalQueue.user.notificationEmail ||
        quoteApprovalQueue.user.ssoLoginEmail;

      const { access_token } = await this.authService.loginUser(
        quoteApprovalQueue.user,
      );
      const confirmationLink = `https://${quoteApprovalQueue.company.subdomain}.vendori.com/${MAIL_QUOTE_CONFIRMATION_PATH}/${quoteApprovalQueue.quoteApprovalQueueId}?access_token=${access_token}`;

      console.log({ ownerQuoteUser });
      const dynamicTemplateData: EmailDynamicTemplate = {
        isVendo: false,
        logoURL: VENDORI_LOGO_URL,
        CTA: confirmationLink,
        subject,
        body: `
          <br/><br/> PIN CODE: ${quoteApprovalQueue.quote.pinCode}
          To view and approve this proposal, please click below.<br/><br/>
          <br/><br/>
          <strong> ${quoteApprovalQueue.company.companyName} | ${ownerQuoteUser.user.phone} | ${ownerQuoteUser.user.region} </strong>
        `,
        companyAddress: VENDORI_COMPANY_ADDRESS,
        emailverify: `
          This message was sent to ${email} because you're a user in the ${quoteApprovalQueue.user.fullName} Vendori account.
          To manage future email notifications, click <a href="https://demo.vendori.com/manage-alerts">here</a> or go to your notifications page within the app.
        `,
      };

      const emailMessage: EmailMessage = {
        subject,
        from: {
          name: 'Vendori',
          email: VENDORI_SUPPORT_EMAIL,
        },
        to: [
          {
            name: quoteApprovalQueue.user.fullName,
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
            companyId: quoteApprovalQueue.companyId,
            quoteId: quoteApprovalQueue.quoteId,
            receiverId: quoteApprovalQueue.user.userId,
            customerId: data.quote.customerId,
            quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: email,
            messageId,
            metaData: emailMessage,
            notificationType: OemNotificationTypeEnum.QUOTE_APPROVED,
            sentAt: new Date(),
            status: 'requested',
            subject,
          },
          manager,
        );

        this.logger.log({
          func: 'OemQuoteApprovalQueuesService/sendOrQueueApprovedEmail',
          quoteId: data.quote.quoteId,
          userId: quoteApprovalQueue.userId,
          quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
          confirmationLink: confirmationLink,
          pinCode: quoteApprovalQueue.quote.pinCode,
          emailMessage,
          result,
          message: 'After sending an approved email',
        });
      } else {
        await this.notificationsService.create(
          {
            companyId: quoteApprovalQueue.companyId,
            quoteId: quoteApprovalQueue.quoteId,
            receiverId: quoteApprovalQueue.user.userId,
            customerId: data.quote.customerId,
            quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: email,
            notificationType: OemNotificationTypeEnum.QUOTE_APPROVED,
            status: 'pending',
          },
          manager,
        );

        this.logger.log({
          func: 'OemQuoteApprovalQueuesService/sendOrQueueApprovedEmail',
          quoteId: data.quote.quoteId,
          quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
          message: 'After queuing an approved email',
        });
      }
    }
  }

  private _getCustomerAddress(customer: OemCustomerEntity) {
    if (!customer) return null;
    const billingAddress = customer.customerAddresses
      .map((customerAddr) => customerAddr.address)
      .find((addr) => addr.addressType === AddressTypeEnum.BILLING);
    const shippingAddress = customer.customerAddresses
      .map((customerAddr) => customerAddr.address)
      .find((addr) => addr.addressType === AddressTypeEnum.SHIPPING);
    return billingAddress || shippingAddress;
  }

  async sendOrQueueApprovedEmailToOwnerAndSavedAlertUsers(
    quoteId: number,
    manager: EntityManager,
  ) {
    // send to the owner and saved alert users
    const quote = await manager
      .createQueryBuilder(OemQuoteEntity, 'quote')
      .innerJoinAndSelect('quote.company', 'company')
      .leftJoinAndSelect('quote.customer', 'customer')
      .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
      .leftJoinAndSelect('customerAddresses.address', 'address')
      .innerJoinAndSelect(
        'quote.usersQuotes',
        'quoteUsers',
        `quoteUsers.isOwner = TRUE OR quoteUsers.approvalStatus IN (:...approvalStatuses)`,
        {
          approvalStatuses: [
            QuoteStatusEnum.APPROVED,
            QuoteStatusEnum.AUTO_APPROVED,
            QuoteStatusEnum.SENT_EXTERNALLY,
          ],
        },
      )
      .innerJoinAndSelect('quoteUsers.user', 'user', 'user.isActive = TRUE')
      .leftJoinAndSelect(
        'quote.notifications',
        'notifications',
        `notifications.notificationType = :notificationType AND notifications.isEnabled = TRUE`,
        { notificationType: OemNotificationTypeEnum.QUOTE_APPROVED },
      )
      .where('quote.quoteId = :quoteId', {
        quoteId,
      })
      .getOne();

    if (!quote || quote.notifications.length > 0) {
      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueApprovedEmailToOwnerAndSavedAlertUsers',
        quoteId,
        notificationIds: quote?.notifications.map(
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

    for (const quoteUser of quote.usersQuotes) {
      const vacationRule = await manager.findOne(OemVacationRule, {
        where: {
          sourceUserId: quoteUser.userId,
        },
        relations: ['targetUser'],
      });
      const targetUser = vacationRule?.targetUser || quoteUser.user;

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
      quote.quoteStatus === QuoteStatusEnum.APPROVED
        ? 'approved'
        : 'auto-approved';
    const subject = `Quote ${quote.quoteName} has been ${approvalStatus}`;
    const netAmount = newDineroDollars(
      quote.netAmount,
      quote.currency as Dinero.Currency,
    ).toFormat('$0,0.00');

    console.log(quote.customer);
    const address = this._getCustomerAddress(quote.customer);
    if (!address) {
      throw `Customer doesn't have any address, plz attach address to customer`;
    }

    //TODO: we really need to have a separated service for sending email. bc it a bit difficult to find what types templates exist and when they are sent
    console.log(address);
    const dynamicTemplateData: EmailDynamicTemplate = {
      logoURL: VENDORI_LOGO_URL,
      CTA: `${APP_ROOT_URL}/quotes/${quote.quoteId}`,
      subject,
      body: `Quote ${quote.quoteName} has been ${approvalStatus}.<br/><br/> <strong> ${quote.company.companyName} | ${netAmount} | ${address.region} </strong>`,
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
            companyId: quote.companyId,
            quoteId: quote.quoteId,
            customerId: quote.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            messageId,
            metaData: emailMessage,
            notificationType: OemNotificationTypeEnum.QUOTE_APPROVED,
            sentAt: new Date(),
            status: 'requested',
            subject,
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueApprovedEmailToOwnerAndSavedAlertUsers',
        quoteId,
        emailMessage,
        result,
        message: 'After sending approved email',
      });
    }

    if (batchList.length > 0) {
      for (const el of batchList) {
        await this.notificationsService.create(
          {
            companyId: quote.companyId,
            quoteId: quote.quoteId,
            customerId: quote.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            notificationType: OemNotificationTypeEnum.QUOTE_APPROVED,
            status: 'pending',
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueApprovedEmailToOwnerAndSavedAlertUsers',
        quoteId,
        message: 'After queuing approved email',
      });
    }
  }

  async sendOrQueueRejectedEmail(
    quoteId: number,
    quoteApprovalQueue: OemQuoteApprovalQueue,
    manager: EntityManager,
  ) {
    // send to the remaining approvers, the owner, and saved alert users
    const quote = await manager
      .createQueryBuilder(OemQuoteEntity, 'quote')
      .innerJoinAndSelect('quote.company', 'company')
      .leftJoinAndSelect('quote.customer', 'customer')
      .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
      .leftJoinAndSelect('customerAddresses.address', 'address')
      .leftJoin(
        'quote.quoteApprovalQueues',
        'quoteApprovalQueues',
        'quoteApprovalQueues.isActive = TRUE AND quoteApprovalQueues.status = :quoteApprovalQueueStatus',
        {
          quoteApprovalQueueStatus: QuoteApprovalQueueStatusEnum.PENDING,
        },
      )
      .innerJoinAndSelect(
        'quote.usersQuotes',
        'quoteUsers',
        `quoteUsers.userId = quoteApprovalQueues.userId
          OR quoteUsers.isOwner = TRUE
          OR quoteUsers.approvalStatus = :approvalStatus`,
        { approvalStatus: QuoteStatusEnum.REJECTED },
      )
      .innerJoinAndSelect('quoteUsers.user', 'user', 'user.isActive = TRUE')
      .leftJoinAndSelect(
        'quote.notifications',
        'notifications',
        `notifications.notificationType = :notificationType AND notifications.isEnabled = TRUE`,
        { notificationType: OemNotificationTypeEnum.QUOTE_REJECTED },
      )
      .where('quote.quoteId = :quoteId', {
        quoteId,
      })
      .getOne();

    if (!quote || quote.notifications.length > 0) {
      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueRejectedEmail',
        quoteId,
        notificationIds: quote?.notifications.map(
          (notification) => notification.notificationId,
        ),
        message: 'Skip sending rejected email',
      });

      return;
    }

    const rejectedUser = await manager.findOne(
      OemUserEntity,
      quoteApprovalQueue.userId,
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

    for (const quoteUser of quote.usersQuotes) {
      const vacationRule = await manager.findOne(OemVacationRule, {
        where: {
          sourceUserId: quoteUser.userId,
        },
        relations: ['targetUser'],
      });
      const targetUser = vacationRule?.targetUser || quoteUser.user;

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
    const subject = `Quote ${quote.quoteName} has been rejected`;
    const netAmount = newDineroDollars(
      quote.netAmount,
      quote.currency as Dinero.Currency,
    ).toFormat('$0,0.00');

    const address = this._getCustomerAddress(quote.customer);
    console.debug({ address });
    const dynamicTemplateData: EmailDynamicTemplate = {
      logoURL: VENDORI_LOGO_URL,
      CTA: `${APP_ROOT_URL}/quotes/${quote.quoteId}`,
      subject,
      body: `${rejectedRole} rejected the quote.<br/><br/> <strong> ${quote.company.companyName} | ${netAmount} | ${address.region} </strong>`,
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
            companyId: quote.companyId,
            quoteId: quote.quoteId,
            customerId: quote.customerId,
            receiverId: el.userId,
            quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            messageId,
            metaData: emailMessage,
            notificationType: OemNotificationTypeEnum.QUOTE_REJECTED,
            sentAt: new Date(),
            status: 'requested',
            subject,
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueRejectedEmail',
        quoteId,
        emailMessage,
        result,
        message: 'After sending rejected email',
      });
    }

    if (batchList.length > 0) {
      for (const el of batchList) {
        await this.notificationsService.create(
          {
            companyId: quote.companyId,
            quoteId: quote.quoteId,
            customerId: quote.customerId,
            receiverId: el.userId,
            quoteApprovalQueueId: quoteApprovalQueue.quoteApprovalQueueId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            notificationType: OemNotificationTypeEnum.QUOTE_REJECTED,
            status: 'pending',
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueRejectedEmail',
        quoteId,
        message: 'After queuing rejected email',
      });
    }
  }

  async sendOrQueueExpiredEmail(quoteId: number, manager: EntityManager) {
    // send to the remaining approvers, the owner, and saved alert users, except for the customer
    const quote = await manager
      .createQueryBuilder(OemQuoteEntity, 'quote')
      .innerJoinAndSelect('quote.company', 'company')
      .leftJoinAndSelect('quote.customer', 'customer')
      .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
      .leftJoinAndSelect('customerAddresses.address', 'address')
      .innerJoinAndSelect(
        'quote.usersQuotes',
        'quoteUsers',
        `
          quoteUsers.isApprover = FALSE AND
          (quoteUsers.isSavedAlertUser = FALSE
          OR quoteUsers.approvalStatus = :approvalStatus)
        `,
        {
          approvalStatus: QuoteStatusEnum.EXPIRED,
        },
      )
      .innerJoinAndSelect('quoteUsers.user', 'user', 'user.isActive = TRUE')
      .leftJoinAndSelect(
        'quote.notifications',
        'notifications',
        `notifications.notificationType = :notificationType AND notifications.isEnabled = TRUE`,
        { notificationType: OemNotificationTypeEnum.QUOTE_EXPIRED },
      )
      .where('quote.quoteId = :quoteId', {
        quoteId,
      })
      .getOne();

    if (!quote || quote.notifications.length > 0) {
      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueExpiredEmail',
        quoteId,
        notificationIds: quote?.notifications.map(
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

    for (const quoteUser of quote.usersQuotes) {
      // filter out external users if the quote is created internally
      if (!quote.isExternal && quoteUser.user.isExternal) {
        continue;
      }

      const vacationRule = await manager.findOne(OemVacationRule, {
        where: {
          sourceUserId: quoteUser.userId,
          isActive: true,
        },
        relations: ['targetUser'],
      });
      const targetUser = vacationRule?.targetUser || quoteUser.user;

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

    const customerAddress = this._getCustomerAddress(quote.customer);
    //TODO: why we do not follow DRY (we have the same functionality and messages in batchEmail, it is annoying to fix something)
    console.log(customerAddress);
    if (emailList.length > 0 && customerAddress) {
      const subject = `Quote ${quote.quoteName} has been expired`;
      const netAmount = newDineroDollars(
        quote.netAmount,
        quote.currency as Dinero.Currency,
      ).toFormat('$0,0.00');

      const dynamicTemplateData: EmailDynamicTemplate = {
        logoURL: VENDORI_LOGO_URL,
        CTA: `${APP_ROOT_URL}/quotes/${quote.quoteId}`,
        subject,
        body: `The expiration date ${quote.expiresAt} has been reached and the quote is now expired.<br/><br/> <strong> ${quote.company.companyName} | ${netAmount} | ${customerAddress.region} </strong>`,
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
        to: _.unionBy(emailList, 'email').map((el) => _.omit(el, 'userId')),
        templateId: MAIL_QUOTE_VENDO_CHANGE_TEMPLATE_ID,
        dynamicTemplateData,
      };

      const result = await sendGridEmailWithDynamicTemplate(emailMessage);
      const messageId = result[0].headers['x-message-id'];

      for (const el of emailList) {
        await this.notificationsService.create(
          {
            companyId: quote.companyId,
            quoteId: quote.quoteId,
            customerId: quote.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            messageId,
            metaData: emailMessage,
            notificationType: OemNotificationTypeEnum.QUOTE_EXPIRED,
            sentAt: new Date(),
            status: 'requested',
            subject,
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueExpiredEmail',
        emailMessage,
        result,
        message: 'After sending expired email',
      });
    }

    if (batchList.length > 0) {
      for (const el of batchList) {
        await this.notificationsService.create(
          {
            companyId: quote.companyId,
            quoteId: quote.quoteId,
            customerId: quote.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            notificationType: OemNotificationTypeEnum.QUOTE_EXPIRED,
            status: 'pending',
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueRejectedEmail',
        quoteId,
        message: 'After queuing expired email',
      });
    }
  }

  async sendOrQueueTransactedEmail(
    quoteId: number,
    manager: EntityManager,
    isIncludeSavedAlertUser = false,
  ) {
    // send to all the approvers and the owner, or the saved alert users
    let quoteQueryBuilder = manager
      .createQueryBuilder(OemQuoteEntity, 'quote')
      .innerJoinAndSelect('quote.company', 'company')
      .leftJoinAndSelect('quote.customer', 'customer')
      .leftJoinAndSelect('customer.customerAddresses', 'customerAddresses')
      .leftJoinAndSelect('customerAddresses.address', 'address');

    if (isIncludeSavedAlertUser) {
      quoteQueryBuilder = quoteQueryBuilder.innerJoinAndSelect(
        'quote.usersQuotes',
        'quoteUsers',
        `
        quoteUsers.isApprover = FALSE AND
        (quoteUsers.isSavedAlertUser = FALSE OR quoteUsers.approvalStatus = :approvalStatus)
        `,
        {
          approvalStatus: QuoteStatusEnum.TRANSACTED,
        },
      );
    } else {
      quoteQueryBuilder = quoteQueryBuilder.innerJoinAndSelect(
        'quote.usersQuotes',
        'quoteUsers',
        `quoteUsers.isApprover = FALSE AND quoteUsers.isSavedAlertUser = FALSE`,
      );
    }

    const quote = await quoteQueryBuilder
      .innerJoinAndSelect('quoteUsers.user', 'user', 'user.isActive = TRUE')
      .innerJoinAndSelect(
        'quote.quoteApprovalQueues',
        'quoteApprovalQueues',
        `quoteApprovalQueues.isActive = TRUE
        AND quoteApprovalQueues.status = :approvedStatus
        AND quoteApprovalQueues.targetType = :customerTargetType`,
        {
          approvedStatus: QuoteApprovalQueueStatusEnum.APPROVED,
          customerTargetType: QuoteApprovalQueueTargetTypeEnum.CUSTOMER,
        },
      )
      .leftJoinAndSelect(
        'quote.notifications',
        'notifications',
        `notifications.notificationType = :notificationType
          AND notifications.isEnabled = TRUE
          AND notifications.receiverId = quoteUsers.userId`,
        { notificationType: OemNotificationTypeEnum.QUOTE_TRANSACTED },
      )
      .where('quote.quoteId = :quoteId', {
        quoteId,
      })
      .getOne();

    if (!quote || quote.notifications.length > 0) {
      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueTransactedEmail',
        quoteId,
        notificationIds: quote?.notifications.map(
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

    //TODO:we need to have a some centralized way to control a vacation rule!
    for (const quoteUser of quote.usersQuotes) {
      const vacationRule = await manager.findOne(OemVacationRule, {
        where: {
          sourceUserId: quoteUser.userId,
          isActive: true,
        },
        relations: ['targetUser'],
      });
      const targetUser = vacationRule?.targetUser || quoteUser.user;

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
      const subject = `Congratulations!<br>${quote.customer.customerName} has accepted your quote!`;

      const transactedDateMoment = moment.utc(
        quote.quoteApprovalQueues[0].updatedAt,
      );
      const transactedTime = transactedDateMoment.format('HH:mm A');
      const transactedDate = transactedDateMoment.format('MM/DD/YYYY');
      const netAmount = newDineroDollars(
        quote.netAmount,
        quote.currency as Dinero.Currency,
      ).toFormat('$0,0.00');

      //TODO: we need to have a separate service to sending emails
      const dynamicTemplateData: EmailDynamicTemplate = {
        logoURL: quote.customer?.logoUrl,
        CTA: `${APP_ROOT_URL}/quotes/${quote.quoteId}`,
        subject,
        body: `At ${transactedTime} on ${transactedDate}, ${quote.customer.customerName} accepted Quote ${quote.quoteName}.<br/><br/> <strong> ${quote.customer.customerName} | ${netAmount} </strong>`,
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
            companyId: quote.companyId,
            quoteId: quote.quoteId,
            customerId: quote.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            messageId,
            metaData: emailMessage,
            notificationType: OemNotificationTypeEnum.QUOTE_TRANSACTED,
            sentAt: new Date(),
            status: 'requested',
            subject,
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueTransactedEmail',
        quoteId: quote.quoteId,
        emailMessage,
        result,
        message: 'After sending transacted email',
      });
    }

    if (batchList.length > 0) {
      for (const el of batchList) {
        await this.notificationsService.create(
          {
            companyId: quote.companyId,
            quoteId: quote.quoteId,
            customerId: quote.customerId,
            receiverId: el.userId,
            fromEmail: VENDORI_SUPPORT_EMAIL,
            toEmail: el.email,
            notificationType: OemNotificationTypeEnum.QUOTE_TRANSACTED,
            status: 'pending',
          },
          manager,
        );
      }

      this.logger.log({
        func: 'OemQuoteApprovalQueuesService/sendOrQueueTransactedEmail',
        quoteId: quote.quoteId,
        message: 'After queuing transacted email',
      });
    }
  }

  private async _isAllQueuesApproved(
    quoteId: number,
    isCustomer = false,
    manager: EntityManager,
  ) {
    const activeQuoteApprovalQueues = await manager.find(
      OemQuoteApprovalQueue,
      {
        where: {
          quoteId,
          isActive: true,
          isEnabled: true,
          targetType: isCustomer
            ? QuoteApprovalQueueTargetTypeEnum.CUSTOMER
            : Not(QuoteApprovalQueueTargetTypeEnum.CUSTOMER),
        },
        relations: ['user', 'user.role'],
      },
    );
    console.log(
      'Getting active quote approval queues',
      activeQuoteApprovalQueues,
    );

    const approvedQueues = activeQuoteApprovalQueues.filter(
      (quoteApprovalQueue) =>
        quoteApprovalQueue.status === QuoteApprovalQueueStatusEnum.APPROVED,
    );

    /* const adminEntriesLength = await this._autoApproveAdminQueue(
      activeQuoteApprovalQueues,
      manager,
    );*/

    return (
      approvedQueues.length > 0 &&
      approvedQueues.length === activeQuoteApprovalQueues.length //- adminEntriesLength
    );
  }

  private async _autoApproveAdminQueue(
    existingEntities: OemQuoteApprovalQueue[],
    manager: EntityManager,
  ) {
    const onlyAdminLeftToApprove = existingEntities.filter(
      (quoteApprovalQueue) =>
        quoteApprovalQueue.status === QuoteApprovalQueueStatusEnum.PENDING &&
        quoteApprovalQueue.user.role?.functionType === FunctionTypeEnum.ADMIN,
    );

    if (onlyAdminLeftToApprove.length > 0)
      // Auto Approve Admin Queue Entry if the other entries are fulfilled
      await manager.save(
        this.repo.create({
          ...onlyAdminLeftToApprove[0],
          status: QuoteApprovalQueueStatusEnum.APPROVED,
        }),
      );

    return onlyAdminLeftToApprove.length;
  }
}
