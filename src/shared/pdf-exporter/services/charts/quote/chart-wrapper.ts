import { ANNUAL_COST_NET_PRICE } from '../../../constants';
import { ChartSeries, CompanyColorsType } from '../../../types';
import { renderChart } from './default-chart';

export function drawChart(
  wrapperName: string = ANNUAL_COST_NET_PRICE,
  xAxisLabels: string[],
  series: ChartSeries[],
  chartWidth = 230,
  colors: CompanyColorsType,
  size: 'sm' | 'lg' = 'lg',
) {
  const chartWrapper = getChartWrapper(wrapperName, colors, size);
  const chart = renderChart(xAxisLabels, series);

  chartWrapper.table.body.push([
    {
      margin: size === 'lg' ? [0, 8, 0, 0] : [0, 4, 0, 0],
      width: chartWidth,
      svg: chart,
    } as any,
  ]);

  return chartWrapper;
}

function getChartWrapper(
  wrapperName: string = ANNUAL_COST_NET_PRICE,
  colors: CompanyColorsType,
  size: 'sm' | 'lg' = 'lg',
) {
  return {
    layout: {
      vLineWidth: () => 0,
      hLineWidth: (rowIndex: number) => {
        return rowIndex === 1 ? 1 : 0;
      },
      hLineColor: () => colors.primaryText,
      paddingTop: () => 0,
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingBottom: () => 2,
    },
    table: {
      widths: ['*'],
      headerRows: 1,
      body: [
        [
          {
            text: wrapperName,
            bold: true,
            fontSize: size === 'lg' ? 7 : 6,
            color: colors.primaryText,
          },
        ],
      ],
    },
  };
}
