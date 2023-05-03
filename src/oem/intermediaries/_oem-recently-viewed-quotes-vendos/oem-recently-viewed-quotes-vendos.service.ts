import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import {
  OemRecentlyViewedQuotesVendos,
  RecentlyViewedQuotesVendos,
} from './oem-recently-viewed-quotes-vendos.entity';
import { CrudRequest } from '@nestjsx/crud';
import { CommonDefaultMethodExtension } from '../../../common/decorators/common-default-method-extention.decorator';
import { SConditionAND, SFields } from '@nestjsx/crud-request/lib/types';

@Injectable()
@CommonDefaultMethodExtension
export class OemRecentlyViewedQuotesVendosService extends TypeOrmCrudService<OemRecentlyViewedQuotesVendos> {
  constructor(
    @InjectRepository(OemRecentlyViewedQuotesVendos)
    public repo: Repository<OemRecentlyViewedQuotesVendos>,
  ) {
    super(repo);
  }

  private _filterNameUUID(
    qb: SelectQueryBuilder<RecentlyViewedQuotesVendos>,
    quoteName: SFields | SConditionAND,
    vendoName: SFields | SConditionAND,
    quoteUUID: SFields | SConditionAND,
    vendoUUID: SFields | SConditionAND,
  ): SelectQueryBuilder<RecentlyViewedQuotesVendos> {
    return qb.andWhere(
      new Brackets((qb) => {
        qb.orWhere('quote.quoteName like :quoteName', { quoteName })
          .orWhere('vendo.vendoName like :vendoName', { vendoName })
          .orWhere('quote.quoteUuid = :quoteUuid', { quoteUuid: quoteUUID })
          .orWhere('vendo.vendoUuid = :vendoUuid', { vendoUuid: vendoUUID });
      }),
    );
  }

  async getMany(req: CrudRequest): Promise<any> {
    // console.log('req.parsed.search', JSON.stringify(req.parsed.search));
    let quoteName =
      req.parsed.search['$and'] &&
      req.parsed.search['$and'][2] &&
      req.parsed.search['$and'][2]['$or']?.find((item) => item['quoteName']);
    quoteName = quoteName && quoteName['quoteName']['$contL'];

    let vendoName =
      req.parsed.search['$and'] &&
      req.parsed.search['$and'][2] &&
      req.parsed.search['$and'][2]['$or']?.find((item) => item['vendoName']);
    vendoName = vendoName && vendoName['vendoName']['$contL'];

    let quoteUUID =
      req.parsed.search['$and'] &&
      req.parsed.search['$and'][2] &&
      req.parsed.search['$and'][2]['$or']?.find((item) => item['quoteUuid']);
    quoteUUID = quoteUUID && quoteUUID['quoteUuid']['$eq'];

    let vendoUUID =
      req.parsed.search['$and'] &&
      req.parsed.search['$and'][2] &&
      req.parsed.search['$and'][2]['$or']?.find((item) => item['vendoUuid']);
    vendoUUID = vendoUUID && vendoUUID['vendoUuid']['$eq'];

    // console.log(
    //   'quoteName',
    //   quoteName,
    //   'vendoName',
    //   vendoName,
    //   'quoteUUID',
    //   quoteUUID,
    //   'vendoUUID',
    //   vendoUUID,
    // );
    let groupBy =
      'recently_viewed_vendos_quotes.vendo_id, ' +
      'recently_viewed_vendos_quotes.quote_id, ' +
      'recently_viewed_vendos_quotes.company_id, ' +
      'recently_viewed_vendos_quotes.recently_viewed_id, ' +
      'quote.quote_id, ' +
      'vendo.vendo_id';

    let total = this.repo
      .createQueryBuilder('recently_viewed_vendos_quotes')
      .select(
        'COUNT(DISTINCT(recently_viewed_vendos_quotes.vendoId, recently_viewed_vendos_quotes.quoteId))',
        'count',
      )
      .leftJoin('recently_viewed_vendos_quotes.quote', 'quote')
      .leftJoin('recently_viewed_vendos_quotes.vendo', 'vendo')
      .where(
        'recently_viewed_vendos_quotes.isEnabled = TRUE AND recently_viewed_vendos_quotes.companyId = :companyId AND recently_viewed_vendos_quotes.userId = :userId',
        {
          companyId: req['user'].companyId,
          userId: req['user'].userId,
        },
      );

    let recently = this.repo
      .createQueryBuilder('recently_viewed_vendos_quotes')
      .leftJoinAndSelect('recently_viewed_vendos_quotes.quote', 'quote')
      .leftJoinAndSelect('recently_viewed_vendos_quotes.vendo', 'vendo')
      .where(
        'recently_viewed_vendos_quotes.isEnabled = TRUE AND recently_viewed_vendos_quotes.companyId = :companyId AND recently_viewed_vendos_quotes.userId = :userId',
        {
          companyId: req['user'].companyId,
          userId: req['user'].userId,
        },
      );

    if (quoteName || vendoName || quoteUUID || vendoUUID) {
      recently = this._filterNameUUID(
        recently,
        quoteName,
        vendoName,
        quoteUUID,
        vendoUUID,
      );
      total = this._filterNameUUID(
        total,
        quoteName,
        vendoName,
        quoteUUID,
        vendoUUID,
      );
    }

    const canJoinQuoteCustomer = !!req.parsed.join.find(
      (obj) => obj.field == 'quote.customer',
    );
    const canJoinVendoCustomer = !!req.parsed.join.find(
      (obj) => obj.field == 'vendo.customer',
    );

    if (canJoinQuoteCustomer) {
      recently = recently.leftJoinAndSelect(
        'quote.customer',
        'quoteCustomer',
        'quoteCustomer.is_enabled = TRUE',
      );
      groupBy +=
        ', quoteCustomer.customer_id, ' +
        'quoteCustomer.company_id, ' +
        'quoteCustomer.licensing_program_id, ' +
        'quoteCustomer.organization_id, ' +
        'quoteCustomer.sales_organization_id, ' +
        'quoteCustomer.customer_name, ' +
        'quoteCustomer.industry, ' +
        'quoteCustomer.customer_email, ' +
        'quoteCustomer.logo_url, ' +
        'quoteCustomer.phone';
    }
    if (canJoinVendoCustomer) {
      recently = recently.leftJoinAndSelect(
        'vendo.customer',
        'vendoCustomer',
        'vendoCustomer.is_enabled = TRUE',
      );
      groupBy +=
        ', vendoCustomer.customer_id, ' +
        'vendoCustomer.company_id, ' +
        'vendoCustomer.licensing_program_id, ' +
        'vendoCustomer.organization_id, ' +
        'vendoCustomer.sales_organization_id, ' +
        'vendoCustomer.customer_name, ' +
        'vendoCustomer.industry, ' +
        'vendoCustomer.customer_email, ' +
        'vendoCustomer.logo_url, ' +
        'vendoCustomer.phone';
    }

    const { offset, limit } = req.parsed;
    const queryBuilder = recently
      .distinctOn([
        'recently_viewed_vendos_quotes.updatedAt',
        'recently_viewed_vendos_quotes.vendoId',
        'recently_viewed_vendos_quotes.quoteId',
      ])
      .orderBy({
        'recently_viewed_vendos_quotes.updatedAt': 'DESC',
        'recently_viewed_vendos_quotes.vendoId': 'DESC',
        'recently_viewed_vendos_quotes.quoteId': 'DESC',
      })
      .groupBy(groupBy)
      .skip(offset)
      .take(limit);

    /**
     *  we use separate request for getting total, bc due distinctOn standard getManyAndCount doesn't work
     *  (typeorm method doesn't group by identifiers)
     */
    total = (await total.getRawOne()).count;

    const page = Math.ceil((offset + 1) / limit);
    const pageCount = Math.ceil(+total / limit);
    const data = await queryBuilder.getMany();

    return {
      data,
      count: data.length,
      total: Number(total),
      page,
      pageCount,
    };
  }
}
