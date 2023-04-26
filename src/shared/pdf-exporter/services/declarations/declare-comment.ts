import { CompanyColorsType } from '../../types';

export function declareComment(
  commentText: string,
  headerText: string,
  colors: CompanyColorsType,
  size: 'sm' | 'lg' = 'lg',
) {
  const defaultPadding = size === 'lg' ? 10 : 4;
  const paddingBottomForFirstRow = size === 'lg' ? 4 : 2;

  return {
    layout: {
      vLineWidth: () => 0,
      hLineWidth: (rowIndex: number) =>
        rowIndex === 0 || rowIndex === 1 ? 0 : defaultPadding,
      hLineColor: () => '#fff',
      paddingTop: () => defaultPadding,
      paddingBottom: (rowIndex: number) =>
        rowIndex === 0 ? paddingBottomForFirstRow : defaultPadding,
      paddingLeft: () => 0,
      paddingRight: () => 0,
    },
    table: {
      // headerRows: 1,
      // keepWithHeaderRows: true,
      widths: ['*'],
      body: [
        [
          {
            text: headerText,
            bold: true,
            fontSize: size === 'lg' ? 8 : 6,
          },
        ],
        [
          {
            text: commentText,
            fillColor: colors.secondary,
            fillOpacity: 0.7,
            margin: size === 'lg' ? [8, 0, 8, 0] : [4, 0, 4, 0],
            fontSize: size === 'lg' ? 7 : 6,
          },
        ],
      ],
    },
    color: colors.primaryText,
  };
}
