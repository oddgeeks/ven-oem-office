import * as dayjs from 'dayjs';
import {
  QuoteProduct,
  QuoteProductTotals,
  QuoteProductTotalsTransformed,
} from '../../types';
import { formatCurrency, formatNumber, formatPercentage } from '../formatters';

/**
 * Transforms single quote product.
 * @private
 */
const transformQuoteProduct = (quoteProduct: any) => {
  const {
    product,
    productType,
    startDate,
    endDate,
    quantity,
    listPrice,
    impliedCustomerPrice,
    netPriceToChannel,
  } = quoteProduct.lockedFields;
  let totalCustomerDiscount = 0;
  let totalChannelDiscount = 0;

  if (impliedCustomerPrice && listPrice) {
    totalCustomerDiscount =
      (100 - (impliedCustomerPrice * 100) / listPrice) / 100;
  }

  if (netPriceToChannel && impliedCustomerPrice) {
    totalChannelDiscount =
      (100 - (netPriceToChannel * 100) / impliedCustomerPrice) / 100;
  }

  const netPrice = netPriceToChannel || impliedCustomerPrice;

  return {
    productName: `\u200B\t${product.productName}`,
    transactionType: productType,
    quantity: {
      value: quantity,
      formattedValue: formatNumber(quantity),
    },
    startDate: {
      value: dayjs(startDate).toDate(),
      formattedValue: dayjs(startDate).format('MM/DD/YY'),
    },
    endDate: {
      value: endDate ? dayjs(endDate).format('MM/DD/YY') : '-',
      formattedValue: endDate ? dayjs(endDate).format('MM/DD/YY') : '-',
    },

    listPrice: {
      value: listPrice,
      formattedValue: formatCurrency(listPrice),
    },

    totalCustomerDiscount: {
      value: totalCustomerDiscount,
      formattedValue: formatPercentage(totalCustomerDiscount),
    },

    customerPrice: {
      value: impliedCustomerPrice,
      formattedValue: formatCurrency(impliedCustomerPrice),
    },

    totalChannelDiscount: {
      value: totalChannelDiscount,
      formattedValue: formatPercentage(totalChannelDiscount),
    },

    netPrice: {
      value: netPrice,
      formattedValue: formatCurrency(netPrice),
    },
    bundleName: quoteProduct.bundle && quoteProduct.bundle.productName,
  };
};

/**
 * Transforms multiple quote products using `transformQuoteProduct` fn.
 */
export const transformQuoteProducts = (quoteProducts: any[]): QuoteProduct[] =>
  quoteProducts.map(transformQuoteProduct);

/**
 * Builds PDF line for quote bundle.
 * @private
 */
const quoteBundleBuilder = (products: any[]) => {
  const startDate = products.sort((a, b) => a.startDate - b.startDate)[0]
    .startDate;
  const { quantity, customerPrice, netPrice, listPrice } =
    calculateQuoteProductTotals(products);

  const structure = {
    productName: { text: products[0].bundleName || null, bold: true },
    transactionType: '',
    quantity: {
      value: quantity,
      formattedValue: formatNumber(quantity),
    },
    startDate: {
      value: startDate.value,
      formattedValue: startDate.formattedValue,
    },
    endDate: {
      value: '',
      formattedValue: '',
    },
    listPrice: {
      value: listPrice,
      formattedValue: formatCurrency(listPrice),
    },
    totalCustomerDiscount: {
      value: '',
      formattedValue: '',
    },
    customerPrice: {
      value: customerPrice,
      formattedValue: formatCurrency(customerPrice),
    },
    totalChannelDiscount: {
      value: '',
      formattedValue: '',
    },
    netPrice: {
      value: netPrice,
      formattedValue: formatCurrency(netPrice),
    },
  };

  return structure;
};

/**
 * Groups products by `bundleId` in object.
 * @private
 */
const groupProductsByBundleId = (data: any) =>
  data.reduce((acc, product) => {
    const { bundleId } = product;

    if (!acc[bundleId]) {
      acc[bundleId] = [];
    }

    const transformedProduct = transformQuoteProduct(product);

    acc[bundleId].push(transformedProduct);

    return acc;
  }, {});

/**
 * Groups products by bundle ids.
 */
export const gatherProductsWithBundles = (quoteProducts: any) => {
  const productsGroupByBundle = groupProductsByBundleId(quoteProducts);
  const bundleIds = Object.keys(productsGroupByBundle);

  return bundleIds.reduceRight((acc, bundleId) => {
    if (bundleId === 'null') {
      acc.push(...productsGroupByBundle[bundleId]);

      return acc;
    }

    const bundleById = quoteBundleBuilder(productsGroupByBundle[bundleId]);

    acc.push(bundleById);
    acc.push(...productsGroupByBundle[bundleId]);

    return acc;
  }, []);
};

export function calculateQuoteProductTotals(
  transformedQuoteProducts: QuoteProduct[],
): QuoteProductTotals {
  return transformedQuoteProducts.reduce(
    (acc, curr) => {
      acc.quantity += curr.quantity.value;
      acc.listPrice += curr.listPrice.value;
      acc.customerPrice += curr.customerPrice.value;
      acc.netPrice += curr.netPrice.value;

      return acc;
    },
    { quantity: 0, listPrice: 0, customerPrice: 0, netPrice: 0 },
  );
}

export function transformQuoteProductTotals(
  quoteProductTotals: any,
): QuoteProductTotalsTransformed {
  return {
    quantity: formatNumber(quoteProductTotals.quantity),
    listPrice: formatCurrency(quoteProductTotals.listPrice),
    customerPrice: formatCurrency(quoteProductTotals.customerPrice),
    netPrice: formatCurrency(quoteProductTotals.netPrice),
  };
}
