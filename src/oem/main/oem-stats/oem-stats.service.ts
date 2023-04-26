import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OemUserEntity } from '../oem-users/oem-user.entity';
import { OemHierarchyEntity } from '../oem-hierarchies/oem-hierarchy.entity';
import { QuoteStatusEnum } from '../oem-quotes/oem-quote.enums/quote-status.enum';
import { VendoStatusEnum } from '../oem-vendos/oem-vendo.enums/vendo-status.enum';
import { IStatsQuery } from './oem-stats.interfaces/stats-query.interface';
import { QuoteApprovalQueueStatusEnum } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.enums/quote-approval-queue-status.enum';
import { VendoApprovalQueueStatusEnum } from '../../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.enums/vendo-approval-queue-status.enum';
import { OemQuoteApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.entity';
import { OemVendoApprovalQueue } from '../../intermediaries/_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.entity';
import { OemQuotesUsers } from '../../intermediaries/_oem-quotes-users/oem-quotes-users.entity';
import { OemVendosUsers } from '../../intermediaries/_oem-vendos-users/oem-vendos-users.entity';
import { SetCurrentTenant } from '../../../common/decorators/set-current-tenant.decorator';

/**
  1. Owner - attached automatically when creating a quote or vendo via frontend
  (only isOwner is true)
   isOwner = true, isWorkflowUser = false, isSavedAlertUser = false, isApprover = false

  2. Customer- attached automatically when creating a quote or vendo via frontend:
  (only isApprover is true)
  isOwner = false, isWorkflowUser = false, isSavedAlertUser = false, isApprover = true
  the others are likely internal or external users

  3. Workflow user, attached by workflow rule via frontend
  (only isWorkflowUser is true)
  isOwner = false, isWorkflowUser = true, isSavedAlertUser = false, isApprover = false

  4. Manually added users:
  (all are false)
  isOwner = false, isWorkflowUser = false, isSavedAlertUser = false, isApprover = false

  5. Saved alert users, attached based on saved alert rules on frontend:
  (only isSavedAlertUser is true)
  isOwner = false, isWorkflowUser = false, isSavedAlertUser = true, isApprover = false
 */

@Injectable()
@SetCurrentTenant
export class OemStatsService {
  constructor(
    @InjectRepository(OemUserEntity)
    public repo: Repository<OemUserEntity>,
  ) {}

  async getTopCustomers(user: any, query: IStatsQuery) {
    const geoHierarchyIds = [user.geoHierarchyId];
    const subHierarchyIds = user.subHierarchies.map(
      (subHierarchy: OemHierarchyEntity) => subHierarchy.hierarchyId,
    );
    geoHierarchyIds.push(...subHierarchyIds);

    const queryBuilder = this.repo
      .createQueryBuilder('users')
      .innerJoin(
        'users.geoHierarchy',
        'geoHierarchy',
        `geoHierarchy.isActive = TRUE
        AND geoHierarchy.isEnabled = TRUE
        AND geoHierarchy.hierarchyId IN (:...geoHierarchyIds)`,
        {
          geoHierarchyIds,
        },
      )
      .leftJoin(
        'users.usersQuotes',
        'quoteUsers',
        `quoteUsers.isApprover = TRUE AND quoteUsers.isSavedAlertUser = FALSE`,
      )
      .leftJoin(
        'quoteUsers.quote',
        'quote',
        `quote.quoteStatus IN (:...quoteStatuses)`,
        {
          quoteStatuses: [
            QuoteStatusEnum.APPROVED,
            QuoteStatusEnum.AUTO_APPROVED,
            QuoteStatusEnum.TRANSACTED,
          ],
        },
      )
      .leftJoin(
        'users.vendosUsers',
        'vendoUsers',
        `vendoUsers.isApprover = TRUE AND vendoUsers.isSavedAlertUser = FALSE`,
      )
      .leftJoin(
        'vendoUsers.vendo',
        'vendo',
        `vendo.vendoStatus IN (:...vendoStatuses)`,
        {
          vendoStatuses: [
            VendoStatusEnum.APPROVED,
            VendoStatusEnum.AUTO_APPROVED,
            VendoStatusEnum.TRANSACTED,
          ],
        },
      )
      .where('users.isEnabled = TRUE AND users.companyId = :companyId', {
        companyId: user.companyId,
      });

    const countQueryBuilder = queryBuilder.select(
      'COUNT(DISTINCT users.userId)',
      'total',
    );
    const { total } = await countQueryBuilder.getRawOne();

    const offset = query.offset ? Number(query.offset) : 0;
    const limit = query.limit ? Number(query.limit) : 10;
    const sort = query.sort || 'netAmount,DESC';
    const sorts = Array.isArray(sort)
      ? sort.map((s) => s.split(','))
      : [sort.split(',')];

    // console.log('offset', offset, 'limit', limit, 'sorts', sorts);

    let resultQueryBuilder = queryBuilder
      .select('users.userId', 'userId')
      .addSelect(
        `TRIM(CONCAT(users.firstName, ' ', users.lastName))`,
        'fullName',
      )
      .addSelect('users.imageUrl', 'imageUrl')
      .addSelect(
        'COUNT(DISTINCT quote.quoteId) + COUNT(DISTINCT vendo.vendoId)',
        'numberOfQuotesAndVendos',
      )
      .addSelect(
        'SUM(COALESCE(quote.netAmount, 0)) + SUM(COALESCE(vendo.netAmount, 0))',
        'netAmount',
      )
      .groupBy('users.userId');

    sorts.forEach(([sortField, sortOrder], i) => {
      if (i === 0) {
        resultQueryBuilder = resultQueryBuilder.orderBy(
          `"${sortField}"`,
          sortOrder as 'ASC' | 'DESC',
        );
      } else {
        resultQueryBuilder = resultQueryBuilder.addOrderBy(
          `"${sortField}"`,
          sortOrder as 'ASC' | 'DESC',
        );
      }
    });

    resultQueryBuilder = resultQueryBuilder.offset(offset).limit(limit);

    const data = await resultQueryBuilder.getRawMany();
    const page = Math.ceil((offset + 1) / limit);
    const pageCount = Math.ceil(total / limit);

    return {
      data,
      count: data.length,
      total,
      page,
      pageCount,
    };
  }

  async getTopApprovers(user: any, query: IStatsQuery) {
    const geoHierarchyIds = [user.geoHierarchyId];
    const subHierarchyIds = user.subHierarchies.map(
      (subHierarchy: OemHierarchyEntity) => subHierarchy.hierarchyId,
    );
    geoHierarchyIds.push(...subHierarchyIds);

    const queryBuilder = this.repo
      .createQueryBuilder('users')
      .innerJoin(
        'users.geoHierarchy',
        'geoHierarchy',
        `geoHierarchy.isActive = TRUE
        AND geoHierarchy.isEnabled = TRUE
        AND geoHierarchy.hierarchyId IN (:...geoHierarchyIds)`,
        {
          geoHierarchyIds,
        },
      )
      .leftJoin(
        'users.usersQuotes',
        'quoteUsers',
        `quoteUsers.isApprover = FALSE AND quoteUsers.isSavedAlertUser = FALSE`,
      )
      .leftJoin(
        OemQuoteApprovalQueue,
        'quoteApprovalQueues',
        'quoteApprovalQueues.status = :quoteApprovalQueueStatus AND quoteApprovalQueues.userId = quoteUsers.userId',
        {
          quoteApprovalQueueStatus: QuoteApprovalQueueStatusEnum.APPROVED,
        },
      )
      .leftJoin('quoteApprovalQueues.quote', 'quote')
      .leftJoin(
        'users.vendosUsers',
        'vendoUsers',
        `vendoUsers.isApprover = FALSE AND vendoUsers.isSavedAlertUser = FALSE`,
      )
      .leftJoin(
        OemVendoApprovalQueue,
        'vendoApprovalQueues',
        'vendoApprovalQueues.status = :vendoApprovalQueueStatus AND vendoApprovalQueues.userId = vendoUsers.userId',
        {
          vendoApprovalQueueStatus: VendoApprovalQueueStatusEnum.APPROVED,
        },
      )
      .leftJoin('vendoApprovalQueues.vendo', 'vendo')
      .where(
        `users.isEnabled = TRUE
        AND users.companyId = :companyId
        AND users.roleId = :roleId`,
        {
          companyId: user.companyId,
          roleId: user.roleId,
        },
      );

    const countQueryBuilder = queryBuilder.select(
      'COUNT(DISTINCT users.userId)',
      'total',
    );
    const { total } = await countQueryBuilder.getRawOne();

    const offset = query.offset ? Number(query.offset) : 0;
    const limit = query.limit ? Number(query.limit) : 10;
    const sort = query.sort || 'netAmount,DESC';
    const sorts = Array.isArray(sort)
      ? sort.map((s) => s.split(','))
      : [sort.split(',')];

    // console.log('offset', offset, 'limit', limit, 'sorts', sorts);

    let resultQueryBuilder = queryBuilder
      .select('users.userId', 'userId')
      .addSelect(
        `TRIM(CONCAT(users.firstName, ' ', users.lastName))`,
        'fullName',
      )
      .addSelect('users.imageUrl', 'imageUrl')
      .addSelect(
        'COUNT(DISTINCT quote.quoteId) + COUNT(DISTINCT vendo.vendoId)',
        'numberOfQuotesAndVendos',
      )
      .addSelect(
        'SUM(COALESCE(quote.netAmount, 0)) + SUM(COALESCE(vendo.netAmount, 0))',
        'netAmount',
      )
      .groupBy('users.userId');

    sorts.forEach(([sortField, sortOrder], i) => {
      if (i === 0) {
        resultQueryBuilder = resultQueryBuilder.orderBy(
          `"${sortField}"`,
          sortOrder as 'ASC' | 'DESC',
        );
      } else {
        resultQueryBuilder = resultQueryBuilder.addOrderBy(
          `"${sortField}"`,
          sortOrder as 'ASC' | 'DESC',
        );
      }
    });

    resultQueryBuilder = resultQueryBuilder.offset(offset).limit(limit);

    const data = await resultQueryBuilder.getRawMany();
    const page = Math.ceil((offset + 1) / limit);
    const pageCount = Math.ceil(total / limit);

    return {
      data,
      count: data.length,
      total,
      page,
      pageCount,
    };
  }

  async getTopCreators(user: any, query: IStatsQuery) {
    const geoHierarchyIds = [user.geoHierarchyId];
    const subHierarchyIds = user.subHierarchies.map(
      (subHierarchy: OemHierarchyEntity) => subHierarchy.hierarchyId,
    );
    geoHierarchyIds.push(...subHierarchyIds);

    const queryBuilder = this.repo
      .createQueryBuilder('users')
      .innerJoin(
        'users.geoHierarchy',
        'geoHierarchy',
        `geoHierarchy.isActive = TRUE
        AND geoHierarchy.isEnabled = TRUE
        AND geoHierarchy.hierarchyId IN (:...geoHierarchyIds)`,
        {
          geoHierarchyIds,
        },
      )
      .leftJoin(
        'users.usersQuotes',
        'quoteUsers',
        `quoteUsers.isOwner = TRUE AND quoteUsers.isSavedAlertUser = FALSE`,
      )
      .leftJoin(
        OemQuotesUsers,
        'currentQuoteUsers',
        `currentQuoteUsers.userId = :currentQuoteUserId
        AND currentQuoteUsers.isSavedAlertUser = FALSE
        AND currentQuoteUsers.quoteId = quoteUsers.quoteId`,
        {
          currentQuoteUserId: user.userId,
        },
      )
      .leftJoin('currentQuoteUsers.quote', 'quote')
      .leftJoin(
        'users.vendosUsers',
        'vendoUsers',
        `vendoUsers.isOwner = TRUE AND vendoUsers.isSavedAlertUser = FALSE`,
      )
      .leftJoin(
        OemVendosUsers,
        'currentVendoUsers',
        `currentVendoUsers.userId = :currentVendoUserId
        AND currentVendoUsers.isSavedAlertUser = FALSE
        AND currentVendoUsers.vendoId = vendoUsers.vendoId`,
        {
          currentVendoUserId: user.userId,
        },
      )
      .leftJoin('currentVendoUsers.vendo', 'vendo')
      .where('users.isEnabled = TRUE AND users.companyId = :companyId', {
        companyId: user.companyId,
      });

    const countQueryBuilder = queryBuilder.select(
      'COUNT(DISTINCT users.userId)',
      'total',
    );
    const { total } = await countQueryBuilder.getRawOne();

    const offset = query.offset ? Number(query.offset) : 0;
    const limit = query.limit ? Number(query.limit) : 10;
    const sort = query.sort || 'netAmount,DESC';
    const sorts = Array.isArray(sort)
      ? sort.map((s) => s.split(','))
      : [sort.split(',')];

    // console.log('offset', offset, 'limit', limit, 'sorts', sorts);

    let resultQueryBuilder = queryBuilder
      .select('users.userId', 'userId')
      .addSelect(
        `TRIM(CONCAT(users.firstName, ' ', users.lastName))`,
        'fullName',
      )
      .addSelect('users.imageUrl', 'imageUrl')
      .addSelect(
        'COUNT(DISTINCT quote.quoteId) + COUNT(DISTINCT vendo.vendoId)',
        'numberOfQuotesAndVendos',
      )
      .addSelect(
        'SUM(COALESCE(quote.netAmount, 0)) + SUM(COALESCE(vendo.netAmount, 0))',
        'netAmount',
      )
      .groupBy('users.userId');

    sorts.forEach(([sortField, sortOrder], i) => {
      if (i === 0) {
        resultQueryBuilder = resultQueryBuilder.orderBy(
          `"${sortField}"`,
          sortOrder as 'ASC' | 'DESC',
        );
      } else {
        resultQueryBuilder = resultQueryBuilder.addOrderBy(
          `"${sortField}"`,
          sortOrder as 'ASC' | 'DESC',
        );
      }
    });

    resultQueryBuilder = resultQueryBuilder.offset(offset).limit(limit);

    const data = await resultQueryBuilder.getRawMany();
    const page = Math.ceil((offset + 1) / limit);
    const pageCount = Math.ceil(total / limit);

    return {
      data,
      count: data.length,
      total,
      page,
      pageCount,
    };
  }
}
