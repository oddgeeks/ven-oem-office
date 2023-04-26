import * as dayjs from 'dayjs';

import { InvoiceScheduleProduct } from '../../types';
import { BillingFrequencyEnum } from '../../../../oem/main/oem-products/oem-product.enums/billing-frequency.enum';
import { formatCurrency } from '../formatters';

const billingFrequencyLabels: {
  [key: string]: {
    prefix: string;
    suffix?: string;
  };
} = {
  [BillingFrequencyEnum.BILL_AS_CONSUMED]: {
    prefix: BillingFrequencyEnum.BILL_AS_CONSUMED,
  },
  [BillingFrequencyEnum.UPFRONT]: {
    prefix: BillingFrequencyEnum.UPFRONT,
  },
  [BillingFrequencyEnum.WEEKLY]: {
    prefix: `${BillingFrequencyEnum.WEEKLY} for`,
    suffix: 'week',
  },
  [BillingFrequencyEnum.MONTHLY]: {
    prefix: `${BillingFrequencyEnum.MONTHLY} for`,
    suffix: 'month',
  },
  [BillingFrequencyEnum.ANNUALLY]: {
    prefix: `${BillingFrequencyEnum.ANNUALLY} for`,
    suffix: 'year',
  },
  [BillingFrequencyEnum.CUSTOM]: {
    prefix: BillingFrequencyEnum.CUSTOM,
  },
};

function _getInvoiceScheduleLabel(quoteProduct: any) {
  const { currentBillingFrequency } = quoteProduct.invoiceSchedule;
  const { startDate, endDate } = quoteProduct.lockedFields;

  const { prefix, suffix } =
    billingFrequencyLabels[currentBillingFrequency as BillingFrequencyEnum];

  let amount = 0;
  switch (currentBillingFrequency as BillingFrequencyEnum) {
    case BillingFrequencyEnum.UPFRONT:
    case BillingFrequencyEnum.BILL_AS_CONSUMED:
    case BillingFrequencyEnum.CUSTOM:
      amount = 0;
      break;

    default:
      // TODO: needs discussion to clarify the calculation of payment dates
      amount = Math.max(
        1,
        Math.ceil(
          dayjs(endDate).diff(
            dayjs(startDate),
            suffix as 'week' | 'month' | 'year',
            true,
          ),
        ),
      );
      break;
  }

  if (amount === 0) {
    return prefix;
  }

  return `${prefix} ${amount} ${amount > 1 ? `${suffix}s` : suffix}`;
}

export function transformInvoiceSchedule(
  quoteProducts: any[],
): InvoiceScheduleProduct[] {
  return quoteProducts.map((quoteProduct) => {
    const { product } = quoteProduct.lockedFields;
    const { prices, currentBillingFrequency } = quoteProduct.invoiceSchedule;
    const transformedPrices = {};

    const totalProductPrice = Object.values(prices ?? []).reduce<number>(
      (acc: number, curr: number) => acc + curr,
      0,
    );

    for (const priceDate in prices) {
      transformedPrices[priceDate] = {
        value: prices[priceDate],
        formattedValue: formatCurrency(prices[priceDate]),
      };
    }

    return {
      totalProductPrice: {
        label: _getInvoiceScheduleLabel(quoteProduct),
        value: totalProductPrice,
        formattedValue: formatCurrency(totalProductPrice),
      },
      productName: product.productName,
      billingFrequency: currentBillingFrequency,
      prices: transformedPrices,
    };
  });
}

export function calculatePaymentDatesForInvoiceSchedule(
  invoiceScheduleProducts: InvoiceScheduleProduct[],
): string[] {
  if (!invoiceScheduleProducts.length) return [];

  const resultDates = new Set<string>();

  for (const invoiceScheduleProduct of invoiceScheduleProducts) {
    const { prices } = invoiceScheduleProduct;

    Object.keys(prices).forEach((priceDate) => resultDates.add(priceDate));
  }

  const resultDatesArray = Array.from(resultDates);

  resultDatesArray.sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return resultDatesArray;
}

export function calculateInvoiceScheduleLabels(
  invoiceScheduleProducts: InvoiceScheduleProduct[],
): string[] {
  if (!invoiceScheduleProducts.length) return [];

  const labels: string[] = [];

  for (const invoiceScheduleProduct of invoiceScheduleProducts) {
    const { label } = invoiceScheduleProduct.totalProductPrice;

    if (!labels.includes(label)) {
      labels.push(label);
    }
  }

  // Sort by order defined in billingFrequencyLabels, for the same prefix sort by amount
  return labels.sort((a, b) => {
    const billingFrequencyPrefixes = Object.values(billingFrequencyLabels).map(
      (label) => label.prefix,
    );
    const aIndex = billingFrequencyPrefixes.findIndex((prefix) =>
      prefix.startsWith(a.split(' ')[0]),
    );
    const bIndex = billingFrequencyPrefixes.findIndex((prefix) =>
      prefix.startsWith(b.split(' ')[0]),
    );
    if (aIndex === bIndex) {
      return a < b ? -1 : 1;
    }

    return aIndex - bIndex;
  });
}

export function buildTableRows(
  invoiceScheduleProducts: InvoiceScheduleProduct[],
  invoiceScheduleLabels: string[],
) {
  const result = [];

  for (const invoiceScheduleLabel of invoiceScheduleLabels) {
    let rowTotal = 0;
    const row = [invoiceScheduleLabel];

    for (const invoiceScheduleProduct of invoiceScheduleProducts) {
      const { label, formattedValue, value } =
        invoiceScheduleProduct.totalProductPrice;

      if (invoiceScheduleLabel !== label) {
        row.push('—');
        continue;
      }

      row.push(formattedValue);
      rowTotal += value;
    }

    row.push(formatCurrency(rowTotal));
    result.push(row);
  }

  return result;
}
