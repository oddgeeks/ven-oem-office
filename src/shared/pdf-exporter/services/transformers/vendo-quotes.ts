import * as dayjs from 'dayjs';
import { VendoTableData } from '../../types';
import { formatCurrency, formatNumber } from '../formatters';

type Dates = {
  startDates: string[];
  endDates: string[];
};

type VendoQuoteTotals = {
  oneTimeQty: number;
  subscriptionQty: number;
  consumptionQty: number;
};

export function transformVendoQuotes(quotes: any[]): VendoTableData[] {
  return quotes.map((q) => {
    const {
      quoteName,
      quoteUuid,
      currency,
      quoteStatus,
      netAmount,
      quotesProducts,
    } = q;
    const { startDates, endDates } = extractDatesFromProducts(quotesProducts);
    const earliestStartDate = startDates[0];
    const latestEndDate = endDates[endDates.length - 1];

    const transformedQuoteProducts = quotesProducts.reduce(
      (acc: VendoQuoteTotals, quoteProduct: any) => {
        const {
          lockedFields: {
            quantity,
            product: { pricingModel },
          },
        } = quoteProduct;

        if (pricingModel?.modelType === 'One Time / Non-Recurring') {
          acc.oneTimeQty += quantity;
        } else if (pricingModel?.modelType === 'Subscription') {
          acc.subscriptionQty += quantity;
        } else {
          acc.consumptionQty += quantity;
        }

        return acc;
      },
      {
        oneTimeQty: 0,
        subscriptionQty: 0,
        consumptionQty: 0,
      },
    );

    return {
      quoteName,
      quoteUuid,
      currency,
      quoteStatus,
      products: quotesProducts,
      startDate: {
        value: earliestStartDate,
        formattedValue: dayjs(earliestStartDate).format('MM/DD/YY'),
      },
      endDate: {
        value: latestEndDate,
        formattedValue: dayjs(latestEndDate).format('MM/DD/YY'),
      },
      oneTimeQty: {
        value: transformedQuoteProducts.oneTimeQty,
        formattedValue: formatNumber(transformedQuoteProducts.oneTimeQty),
      },
      subscriptionQty: {
        value: transformedQuoteProducts.subscriptionQty,
        formattedValue: formatNumber(transformedQuoteProducts.subscriptionQty),
      },
      consumptionQty: {
        value: transformedQuoteProducts.consumptionQty,
        formattedValue: formatNumber(transformedQuoteProducts.consumptionQty),
      },
      totalNetCost: {
        value: netAmount,
        formattedValue: formatCurrency(netAmount),
      },
    };
  });
}

/**
 * Get dates from the products in the quote
 */
function extractDatesFromProducts(quoteProducts: any[]): Dates {
  if (!quoteProducts) return { startDates: [], endDates: [] };

  const productDates = quoteProducts.reduce(
    (acc: Dates, quoteProduct) => {
      const {
        lockedFields: { startDate, endDate },
      } = quoteProduct;

      if (startDate) {
        acc.startDates.push(dayjs(startDate).format('MM/DD/YYYY'));
      }

      if (endDate) {
        acc.endDates.push(dayjs(endDate).format('MM/DD/YYYY'));
      }

      return acc;
    },
    { startDates: [], endDates: [] },
  );

  productDates.startDates.sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );
  productDates.endDates.sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  return productDates;
}
