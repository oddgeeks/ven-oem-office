import * as dayjs from 'dayjs';
import {
  barChartBorderRadius,
  quoteChartColors,
  vendoChartColors,
} from '../../constants';
import {
  QuotesChartData,
  ChartSeries,
  VendoChartData,
  VendoTableData,
  DealTypeEnum,
} from '../../types';

export function transformChartProducts(
  dealType: DealTypeEnum,
  quoteProducts: any[],
): QuotesChartData[] {
  return quoteProducts.map((quoteProduct, index) => {
    const {
      product,
      startDate,
      endDate,
      netPriceToChannel,
      impliedCustomerPrice,
    } = quoteProduct.lockedFields;
    const yearsDiff = Math.ceil(
      dayjs(endDate).diff(dayjs(startDate), 'year', true),
    );
    const netPrice =
      dealType === DealTypeEnum.CHANNEL
        ? netPriceToChannel
        : impliedCustomerPrice;
    const annualCost = new Array<number>(yearsDiff).fill(netPrice / yearsDiff);
    const chartColor = quoteChartColors[index % quoteChartColors.length].hex();

    return {
      annualCost,
      totalProductPrice: netPrice,
      productName: product.productName,
      modelType: product.pricingModel?.modelType || '',
      color: chartColor,
    };
  });
}

export function buildAnnualSummarySeries(
  transformedQuoteProducts: QuotesChartData[],
): {
  series: ChartSeries[];
  xAxisLabels: string[];
} {
  const numberOfYears = Math.max(
    ...transformedQuoteProducts.map((p) => p.annualCost.length),
  );
  const xAxisLabels = new Array(numberOfYears)
    .fill(0)
    .map((_, index) => `Year ${index + 1}`);

  const series = [];

  for (const quoteProduct of transformedQuoteProducts) {
    series.push({
      type: 'bar',
      itemStyle: {
        borderRadius: barChartBorderRadius,
        color: quoteProduct.color,
      },
      data: [...quoteProduct.annualCost],
    });
  }

  return {
    series,
    xAxisLabels,
  };
}

export function buildUnitEconomicsSeries(
  transformedQuoteProducts: QuotesChartData[],
): {
  series: ChartSeries[];
  xAxisLabels: string[];
} {
  const uniqueModelTypes = new Set(
    transformedQuoteProducts.map((p) => p.modelType),
  );
  const xAxisLabels = [];
  const series = [];

  uniqueModelTypes.forEach((modelType) => {
    xAxisLabels.push(modelType);
  });

  for (const quoteProduct of transformedQuoteProducts) {
    series.push({
      type: 'bar',
      itemStyle: {
        borderRadius: barChartBorderRadius,
        color: quoteProduct.color,
      },
      data: [],
    });

    xAxisLabels.forEach((modelType) => {
      if (modelType === quoteProduct.modelType) {
        series[series.length - 1].data.push(quoteProduct.totalProductPrice);
      } else {
        series[series.length - 1].data.push(0);
      }
    });
  }

  return {
    series,
    xAxisLabels,
  };
}

export function transformChartQuotes(
  transformedQuotes: VendoTableData[],
): VendoChartData[] {
  return transformedQuotes.map((quote, index) => {
    const { startDate, endDate, totalNetCost, quoteName } = quote;
    const yearsDiff = Math.ceil(
      dayjs(endDate.formattedValue).diff(
        dayjs(startDate.formattedValue),
        'year',
        true,
      ),
    );
    const netCost = new Array(yearsDiff).fill(totalNetCost.value / yearsDiff);

    return {
      quoteName,
      totalNetCost: netCost,
      color: vendoChartColors[index].hex(),
    };
  });
}

export function buildQuotesCostSeries(transformedQuotes: VendoChartData[]): {
  series: ChartSeries[];
  xAxisLabels: string[];
} {
  const numberOfYears = Math.max(
    ...transformedQuotes.map((q) => q.totalNetCost.length),
  );
  const xAxisLabels = new Array(numberOfYears)
    .fill(0)
    .map((_, index) => `Year ${index + 1}`);

  const series = [];

  transformedQuotes.forEach((quote) => {
    series.push({
      type: 'bar',
      itemStyle: {
        borderRadius: barChartBorderRadius,
        color: quote.color,
      },
      data: [...quote.totalNetCost],
    });
  });

  return {
    series,
    xAxisLabels,
  };
}
