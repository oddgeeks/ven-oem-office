import { ChartSeries, CompanyColorsType } from '../../../types';
import { renderVendoChart } from './default-chart';

export function drawVendoChart(
  xAxisLabels: string[],
  series: ChartSeries[],
  colors: CompanyColorsType,
) {
  const chartWrapper = getVendoChartWrapper(colors);
  const chart = renderVendoChart(xAxisLabels, series);

  chartWrapper.table.body.push([
    {
      margin: [0, 8, 0, 0],
      width: 595,
      svg: chart,
    } as any,
  ]);

  return chartWrapper;
}

function getVendoChartWrapper(colors: CompanyColorsType) {
  return {
    layout: {
      vLineWidth: () => 0,
      hLineWidth: () => 0,
      hLineColor: () => colors.primaryText,
      paddingTop: () => 0,
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingBottom: () => 2,
    },
    table: {
      widths: ['*'],
      body: [],
    },
  };
}
