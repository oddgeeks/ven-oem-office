import { Inject, Injectable } from '@nestjs/common';

import { CrudRequest } from '@nestjsx/crud';
import { OemQuotesService } from '../../main/oem-quotes/oem-quotes.service';
import { OemVendosService } from '../../main/oem-vendos/oem-vendos.service';
import { OemProductsService } from '../../main/oem-products/oem-products.service';

const filterObj = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(predicate));

const filterRequest = (req, fieldNames) => {
  if (req && typeof req === 'object') {
    for (const i in req) {
      for (let j = 0; j < fieldNames.length; j++) {
        if (Array.isArray(req[i])) {
          req[i] = req[i].filter(
            (obj) =>
              (obj && !obj.field) ||
              (obj &&
                obj.field &&
                obj.field.toLowerCase().indexOf(fieldNames[j]) == -1),
          );
        } else {
          if (req[i] && typeof req[i] === 'object')
            req[i] = filterObj(
              req[i],
              ([name, item]) => name.toLowerCase().indexOf(fieldNames[j]) == -1,
            );
        }
      }
      filterRequest(req[i], fieldNames);
    }
  }
};

//WE DO NOT USE setCurrentTenancy here, bc we use quote and vendo services, where it is already applied
@Injectable()
export class OemQuotesVendosProductsService {
  constructor(
    @Inject(OemQuotesService) public quoteService,
    @Inject(OemVendosService) public vendoService,
    @Inject(OemProductsService) public productService,
  ) {}
  async getMany(req: CrudRequest) {
    let currentLimit = null;
    let currentOffset = null;
    if (Number.isInteger(req.parsed.limit)) {
      currentLimit = req.parsed.limit - Math.floor(req.parsed.limit / 3);
    }
    if (Number.isInteger(req.parsed.offset)) {
      currentOffset = req.parsed.offset - Math.floor(req.parsed.offset / 3);
    }
    req.parsed.limit = currentLimit * 3;
    req.parsed.offset = currentOffset;
    req.parsed.sort = req.parsed.sort.concat({
      field: `updatedAt`,
      order: 'DESC',
    });

    req.parsed.join = req.parsed.join.concat([
      { field: 'geoHierarchy', select: undefined },
    ]);
    const reqQuotes = {
      ...req,
    };
    filterRequest(reqQuotes, ['vendo', 'product']);
    const quotes = await this.quoteService.getMany(reqQuotes);

    const reqVendos = {
      ...req,
    };
    filterRequest(reqVendos, ['quote', 'product']);
    const vendos = await this.vendoService.getMany(reqVendos);

    const reqProducts = {
      ...req,
    };

    filterRequest(reqProducts, ['quote', 'vendo', 'geohierarchy']);
    const products = await this.productService.getMany(reqProducts);

    const quotesVendosProducts = {
      data: [],
      count: 0,
      total: quotes.total + vendos.total + products.total,
      pageCount: 1,
    };
    quotesVendosProducts.data = products.data.concat(
      quotes.data.concat(vendos.data),
    );
    quotesVendosProducts.data.sort(
      (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    );
    quotesVendosProducts.data.slice(
      req.parsed.offset || 0,
      req.parsed.offset || req.parsed.limit || quotesVendosProducts.data.length,
    );
    quotesVendosProducts.count = quotesVendosProducts.data.length;
    quotesVendosProducts.pageCount = Math.floor(
      quotesVendosProducts.total / quotesVendosProducts.count,
    );
    return quotesVendosProducts;
  }
}
