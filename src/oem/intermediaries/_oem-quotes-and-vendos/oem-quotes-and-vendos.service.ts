import { Injectable, NotFoundException } from '@nestjs/common';
import { getManager } from 'typeorm';

import { IQuotesAndVendosQuery } from './oem-quotes-and-vendos.interfaces/quotes-and-vendos-query.interface';
import { QuotesAndVendosEndpoint } from './oem-quotes-and-vendos.interfaces/quotes-and-vendos-endpoint.type';
import { QuoteStatusEnum } from '../../main/oem-quotes/oem-quote.enums/quote-status.enum';
import { VendoStatusEnum } from '../../main/oem-vendos/oem-vendo.enums/vendo-status.enum';
import { QuoteApprovalQueueStatusEnum } from '../_oem-approval-queues/_oem-quote-approval-queues/oem-quote-approval-queue.enums/quote-approval-queue-status.enum';
import { VendoApprovalQueueStatusEnum } from '../_oem-approval-queues/_oem-vendo-approval-queues/oem-vendo-approval-queue.enums/vendo-approval-queue-status.enum';

@Injectable()
export class OemQuotesAndVendosService {
  toSnakeCase(inputString: string) {
    return inputString
      .split('')
      .map((character) => {
        if (character == character.toUpperCase()) {
          return `_${character.toLowerCase()}`;
        } else {
          return character;
        }
      })
      .join('');
  }

  filterAndMapOrs(ors: string[][]) {
    const names = ['quoteName', 'vendoName'];
    const uuids = ['quoteUuid', 'vendoUuid'];

    const filteredOrs = ors
      .filter((or) => [...names, ...uuids].includes(or[0]))
      .map(([key, operator, value]) => {
        //console.log('value', value, 'names', names, 'key', key);
        const snakeCasedKey = this.toSnakeCase(key);
        //originally we checked ILIKE only for names
        if (names.includes(key)) {
          return `${snakeCasedKey} ILIKE '%${value}%'`;
        }
        return `${snakeCasedKey} = '${value}'`;
      });

    return filteredOrs;
  }

  mapResults(
    results: any[],
    attributes: {
      Quote: string[];
      Vendo: string[];
    },
  ) {
    return results.map((r) => {
      const type = r.type as 'Quote' | 'Vendo';
      const mappedResult = { type };

      if (attributes[type])
        attributes[type].forEach((attr) => {
          const snakeCasedKey = this.toSnakeCase(attr);
          mappedResult[attr] = r[snakeCasedKey];
        });

      return mappedResult;
    });
  }

  getMainSQL(endpoint: QuotesAndVendosEndpoint, user: any) {
    const filteredUserId = user.dataAccessFilter?.userId;
    const assignedOnlyFilter = filteredUserId
      ? `AND user_id = ${filteredUserId}`
      : '';

    const filteredGeoHierarchyIds = user.dataAccessFilter?.geoHierarchyIds;
    const geoHierarchyIdSql = filteredGeoHierarchyIds?.join(', ');
    // console.log(
    //   'getMainSQL filteredUserId',
    //   filteredUserId,
    //   'geoHierarchyIdSql',
    //   geoHierarchyIdSql,
    // );
    let sql: string;
    //TODO: lets use queryBuilder , bc we can get sql inject here TRIM(concat(ou.first_name, ' ', ou.last_name), just trim do not resolve issue
    //TODO: my thoughts: we do not check is_enabled or is_active - that might be an issue, also might be a problem with pagination, honestly I don't know why we do not use typeorm approach instead of manual sql request
    if (endpoint === 'pending-approval') {
      sql = `
        (
          SELECT DISTINCT ON (q.quote_id)
            'Quote' AS type,
            q.quote_id, q.updated_at, q.submitted_at, q.net_amount, q.quote_name, q.quote_uuid, q.quote_status, q.is_enabled, q.geo_hierarchy_id, q.company_id,
            c.customer_name,
            ou.user_id AS owner_user_id, TRIM(concat(ou.first_name, ' ', ou.last_name)) AS owner_user_name,
            cqu.user_id
          FROM oem.oem_quotes q
          LEFT JOIN oem.oem_customers c ON q.customer_id = c.customer_id
          INNER JOIN oem.oem_quotes_users cqu ON cqu.quote_id = q.quote_id ${assignedOnlyFilter}
          INNER JOIN oem.oem_quote_approval_queues cqaq ON cqaq.quote_id = q.quote_id AND
            cqaq.user_id = cqu.user_id AND cqaq.is_active = TRUE AND cqaq.status = '${QuoteApprovalQueueStatusEnum.PENDING}'
          INNER JOIN oem.oem_approval_queue_priorities caqp ON caqp.approval_queue_priority_id = cqaq.approval_queue_priority_id
          LEFT JOIN oem.oem_quotes_users oqu ON oqu.quote_id = q.quote_id AND oqu.is_owner = TRUE
          LEFT JOIN oem.oem_users ou ON ou.user_id = oqu.user_id
          WHERE
            q.quote_status = '${QuoteStatusEnum.PENDING_INTERNAL_APPROVAL}'
            AND caqp.approval_queue_priority_id IN (
              SELECT aqp.approval_queue_priority_id
              FROM oem.oem_approval_queue_priorities aqp
              INNER JOIN oem.oem_quote_approval_queues qaq ON
                aqp.approval_queue_priority_id = qaq.approval_queue_priority_id
                AND qaq.quote_id = q.quote_id
                AND qaq.status = '${QuoteApprovalQueueStatusEnum.PENDING}'
                AND qaq.is_active = TRUE
              ORDER BY aqp.priority ASC NULLS LAST
              LIMIT 1
            )
        ) quotes
        NATURAL FULL JOIN
        (
          SELECT DISTINCT ON (v.vendo_id)
            'Vendo' AS type,
            v.vendo_id, v.updated_at, v.submitted_at, v.net_amount, v.vendo_name, v.vendo_uuid, v.vendo_status, v.is_enabled, v.geo_hierarchy_id, v.company_id,
            c.customer_name,
            ou.user_id AS owner_user_id, TRIM(concat(ou.first_name, ' ', ou.last_name)) AS owner_user_name,
            cvu.user_id
          FROM oem.oem_vendos v
          LEFT JOIN oem.oem_customers c ON v.customer_id = c.customer_id
          INNER JOIN oem.oem_vendos_users cvu ON cvu.vendo_id = v.vendo_id ${assignedOnlyFilter}
          INNER JOIN oem.oem_vendo_approval_queues cvaq ON cvaq.vendo_id = v.vendo_id AND
            cvaq.user_id = cvu.user_id AND cvaq.is_active = TRUE AND cvaq.status = '${VendoApprovalQueueStatusEnum.PENDING}'
          INNER JOIN oem.oem_approval_queue_priorities caqp ON caqp.approval_queue_priority_id = cvaq.approval_queue_priority_id
          LEFT JOIN oem.oem_vendos_users ovu ON ovu.vendo_id = v.vendo_id AND ovu.is_owner = TRUE
          LEFT JOIN oem.oem_users ou ON ou.user_id = ovu.user_id
          WHERE v.vendo_status = '${VendoStatusEnum.PENDING_INTERNAL_APPROVAL}'
            AND caqp.approval_queue_priority_id IN (
            SELECT aqp.approval_queue_priority_id
            FROM oem.oem_approval_queue_priorities aqp
            INNER JOIN oem.oem_vendo_approval_queues vaq ON
              aqp.approval_queue_priority_id = vaq.approval_queue_priority_id
              AND vaq.vendo_id = v.vendo_id
              AND vaq.status = '${VendoApprovalQueueStatusEnum.PENDING}'
              AND vaq.is_active = TRUE
            ORDER BY aqp.priority ASC NULLS LAST
            LIMIT 1
          )
        ) vendos
      `;
    } else if (endpoint === 'all') {
      sql = `
        (
           SELECT DISTINCT ON (q.quote_id)
            'Quote' AS type,
            q.quote_id, q.created_at, q.updated_at, q.quote_name, q.net_amount, q.quote_uuid, q.opportunity_id, q.quote_status, q.is_enabled, q.geo_hierarchy_id, q.company_id,
            c.customer_name,
            ou.user_id AS owner_user_id, TRIM(concat(ou.first_name, ' ', ou.last_name)) AS owner_user_name,
            cqu.user_id
          FROM oem.oem_quotes q
          LEFT JOIN oem.oem_customers c ON q.customer_id = c.customer_id
          INNER JOIN oem.oem_quotes_users cqu ON cqu.quote_id = q.quote_id ${assignedOnlyFilter}
          LEFT JOIN oem.oem_quotes_users oqu ON oqu.quote_id = q.quote_id AND oqu.is_owner = TRUE
          LEFT JOIN oem.oem_users ou ON ou.user_id = oqu.user_id
        ) quotes
        NATURAL FULL JOIN
        (
          SELECT DISTINCT ON (v.vendo_id)
            'Vendo' AS type,
            v.vendo_id, v.created_at, v.updated_at, v.vendo_name, v.net_amount, v.vendo_uuid, v.opportunity_id, v.vendo_status, v.is_enabled, v.geo_hierarchy_id, v.company_id,
            c.customer_name,
            ou.user_id AS owner_user_id, TRIM(concat(ou.first_name, ' ', ou.last_name)) AS owner_user_name,
            cvu.user_id
          FROM oem.oem_vendos v
          LEFT JOIN oem.oem_customers c ON v.customer_id = c.customer_id
          INNER JOIN oem.oem_vendos_users cvu ON cvu.vendo_id = v.vendo_id ${assignedOnlyFilter}
          LEFT JOIN oem.oem_vendos_users ovu ON ovu.vendo_id = v.vendo_id AND ovu.is_owner = TRUE
          LEFT JOIN oem.oem_users ou ON ou.user_id = ovu.user_id
        ) vendos
      `;
    } else if (endpoint === 'workflow-pending-approval') {
      //TODO: we should not use params in simple string (I think would be betetr override TYPEROM function to support full join instead of using a lot raw request)
      sql = `
        (
           SELECT DISTINCT ON (q.quote_id)
            'Quote' AS type,
            q.quote_id, q.updated_at, q.submitted_at, q.net_amount, q.quote_name, q.quote_uuid, q.opportunity_id, q.created_at, AGE(date_trunc('day', q.submitted_at)) as days_since_submission, q.quote_status, q.is_enabled, q.geo_hierarchy_id, q.company_id,
            c.customer_name,
            ou.user_id AS owner_user_id, TRIM(concat(ou.first_name, ' ', ou.last_name)) AS owner_user_name,
            h.hierarchy_name,
            cqu.user_id
          FROM oem.oem_quotes q
          LEFT JOIN oem.oem_customers c ON q.customer_id = c.customer_id
          INNER JOIN oem.oem_hierarchies h ON q.geo_hierarchy_id = h.hierarchy_id
          INNER JOIN oem.oem_quotes_users cqu ON cqu.quote_id = q.quote_id ${assignedOnlyFilter}
          INNER JOIN oem.oem_quote_approval_queues cqaq ON cqaq.quote_id = q.quote_id AND
            cqaq.user_id = cqu.user_id AND cqaq.is_active = TRUE AND cqaq.status = '${QuoteApprovalQueueStatusEnum.PENDING}'
          INNER JOIN oem.oem_approval_queue_priorities caqp ON caqp.approval_queue_priority_id = cqaq.approval_queue_priority_id
          LEFT JOIN oem.oem_quotes_users oqu ON oqu.quote_id = q.quote_id AND oqu.is_owner = TRUE
          LEFT JOIN oem.oem_users ou ON ou.user_id = oqu.user_id
          WHERE
            q.quote_status = '${QuoteStatusEnum.PENDING_INTERNAL_APPROVAL}'
            AND caqp.approval_queue_priority_id IN (
              SELECT aqp.approval_queue_priority_id
              FROM oem.oem_approval_queue_priorities aqp
              INNER JOIN oem.oem_quote_approval_queues qaq ON
                aqp.approval_queue_priority_id = qaq.approval_queue_priority_id
                AND qaq.quote_id = q.quote_id
                AND qaq.status = '${QuoteApprovalQueueStatusEnum.PENDING}'
                AND qaq.is_active = TRUE
              ORDER BY aqp.priority ASC NULLS LAST
              LIMIT 1
            )
        ) quotes
        NATURAL FULL JOIN
        (
           SELECT DISTINCT ON (v.vendo_id)
            'Vendo' AS type,
            v.vendo_id, v.updated_at, v.submitted_at, v.net_amount, v.vendo_name, v.vendo_uuid, v.opportunity_id, v.created_at, AGE(date_trunc('day', v.submitted_at)) as days_since_submission, v.vendo_status, v.is_enabled, v.geo_hierarchy_id, v.company_id,
            c.customer_name,
            ou.user_id AS owner_user_id, TRIM(concat(ou.first_name, ' ', ou.last_name)) AS owner_user_name,
            h.hierarchy_name,
            cvu.user_id
          FROM oem.oem_vendos v
          LEFT JOIN oem.oem_customers c ON v.customer_id = c.customer_id
          INNER JOIN oem.oem_hierarchies h ON v.geo_hierarchy_id = h.hierarchy_id
          INNER JOIN oem.oem_vendos_users cvu ON cvu.vendo_id = v.vendo_id ${assignedOnlyFilter}
          INNER JOIN oem.oem_vendo_approval_queues cvaq ON cvaq.vendo_id = v.vendo_id AND
            cvaq.user_id = cvu.user_id AND cvaq.is_active = TRUE AND cvaq.status = '${VendoApprovalQueueStatusEnum.PENDING}'
          INNER JOIN oem.oem_approval_queue_priorities caqp ON caqp.approval_queue_priority_id = cvaq.approval_queue_priority_id
          LEFT JOIN oem.oem_vendos_users ovu ON ovu.vendo_id = v.vendo_id AND ovu.is_owner = TRUE
          LEFT JOIN oem.oem_users ou ON ou.user_id = ovu.user_id
          WHERE v.vendo_status = '${VendoStatusEnum.PENDING_INTERNAL_APPROVAL}'
            AND caqp.approval_queue_priority_id IN (
            SELECT aqp.approval_queue_priority_id
            FROM oem.oem_approval_queue_priorities aqp
            INNER JOIN oem.oem_vendo_approval_queues vaq ON
              aqp.approval_queue_priority_id = vaq.approval_queue_priority_id
              AND vaq.vendo_id = v.vendo_id
              AND vaq.status = '${VendoApprovalQueueStatusEnum.PENDING}'
              AND vaq.is_active = TRUE
            ORDER BY aqp.priority ASC NULLS LAST
            LIMIT 1
          )
        ) vendos
      `;
    } else {
      return null;
    }

    sql += `WHERE is_enabled = TRUE AND company_id = ${user.companyId}`;
    if (geoHierarchyIdSql) {
      sql += ` AND geo_hierarchy_id IN (${geoHierarchyIdSql})`;
    }

    return sql;
  }

  getSelectAttributes(endpoint: QuotesAndVendosEndpoint) {
    const defaultResponse = {
      Quote: [
        'quoteId',
        'createdAt',
        'updatedAt',
        'quoteName',
        'customerName',
        'ownerUserId',
        'ownerUserName',
        'netAmount',
        'quoteUuid',
        'opportunityId',
        'quoteStatus',
      ],
      Vendo: [
        'vendoId',
        'createdAt',
        'updatedAt',
        'vendoName',
        'customerName',
        'ownerUserId',
        'ownerUserName',
        'netAmount',
        'vendoUuid',
        'opportunityId',
        'vendoStatus',
      ],
    };

    if (endpoint === 'pending-approval') {
      return {
        Quote: [
          'quoteId',
          'updatedAt',
          'submittedAt',
          'customerName',
          'ownerUserId',
          'ownerUserName',
          'netAmount',
          'quoteName',
          'quoteUuid',
          'quoteStatus',
        ],
        Vendo: [
          'vendoId',
          'updatedAt',
          'submittedAt',
          'customerName',
          'ownerUserId',
          'ownerUserName',
          'netAmount',
          'vendoName',
          'vendoUuid',
          'vendoStatus',
        ],
      };
    } else if (endpoint === 'all') {
      return defaultResponse;
    } else if (endpoint === 'workflow-pending-approval') {
      return {
        Quote: [
          'quoteId',
          'createdAt',
          'updatedAt',
          'submittedAt',
          'customerName',
          'netAmount',
          'quoteName',
          'ownerUserId',
          'ownerUserName',
          'geoHierarchyId',
          'hierarchyName',
          'quoteUuid',
          'opportunityId',
          'daysSinceSubmission',
          'quoteStatus',
        ],
        Vendo: [
          'vendoId',
          'createdAt',
          'updatedAt',
          'submittedAt',
          'customerName',
          'netAmount',
          'vendoName',
          'ownerUserId',
          'ownerUserName',
          'geoHierarchyId',
          'hierarchyName',
          'vendoUuid',
          'opportunityId',
          'daysSinceSubmission',
          'vendoStatus',
        ],
      };
    } else {
      return defaultResponse;
    }

    // return null;
  }

  async getMany(
    endpoint: QuotesAndVendosEndpoint,
    user: any,
    query: IQuotesAndVendosQuery,
  ) {
    // console.log('getAll user', user, 'query', query);
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit && Number(query.limit);

    const sort = query.sort || 'updatedAt,DESC';
    const sorts = Array.isArray(sort)
      ? sort.map((s) => s.split(','))
      : [sort.split(',')];

    const or = query.or || [];
    const ors = Array.isArray(or)
      ? or.map((o) => o.split('||'))
      : [or.split('||')];
    const filteredOrs = this.filterAndMapOrs(ors);

    const manager = getManager();

    // SELECT * FROM or SELECT COUNT(type) FROM
    let sqlQuery = this.getMainSQL(endpoint, user);
    if (!sqlQuery) {
      throw new NotFoundException('Invalid endpoint');
    }

    if (filteredOrs.length > 0) {
      sqlQuery = `${sqlQuery} AND (${filteredOrs.join(' OR ')})`;
    }

    const countQuery = `SELECT COUNT(type) as total FROM ${sqlQuery}`;
    const countResults = await manager.query(countQuery);
    const total = Number(countResults[0].total);

    if (sorts.length === 1) {
      const [sortField, sortOrder] = sorts[0];
      const snakeCasedSortField = this.toSnakeCase(sortField);
      sqlQuery = `${sqlQuery} ORDER BY ${snakeCasedSortField} ${sortOrder} NULLS LAST`;
    } else if (sorts.length > 1) {
      const sortFields = sorts
        .map(([field, order]) => this.toSnakeCase(field))
        .join(', ');
      const sortOrder = sorts[0][1];
      sqlQuery = `${sqlQuery} ORDER BY CONCAT(${sortFields}) ${sortOrder} NULLS LAST`;
    }

    const offset = limit ? (page - 1) * limit : 0;
    if (offset) {
      sqlQuery = `${sqlQuery} OFFSET ${offset}`;
    }

    if (limit) {
      sqlQuery = `${sqlQuery} LIMIT ${limit}`;
    }

    //const allQuery = `explain analyze verbose SELECT * FROM ${sqlQuery}`;
    const allQuery = `SELECT * FROM ${sqlQuery}`;
    const results = await manager.query(allQuery);
    /*let text = '';
    for (const result of results) {
      text += JSON.stringify(result) + '\n';
      console.log(text);
    }
*/

    const attributes = this.getSelectAttributes(endpoint);

    const data = this.mapResults(results, attributes);
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
