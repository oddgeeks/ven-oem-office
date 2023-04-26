import { CompanyColorsType } from '../../types';
import {
  CONTAINER_X_MARGIN,
  CONTAINER_Y_MARGIN,
  EVEN_PAGE_BORDER_BOTTOM_RADIUS,
  EVEN_PAGE_BORDER_TOP_RADIUS,
  ODD_PAGE_BORDER_BOTTOM_RADIUS,
  ODD_PAGE_BORDER_TOP_RADIUS,
} from '../../constants';

type PageSize = {
  height: number;
  width: number;
};

export function declareBackgroundImage(
  pageSize: PageSize,
  isEvenPage: boolean,
  colors: CompanyColorsType,
) {
  const background = {
    canvas: [
      {
        type: 'rect',
        x: 0,
        y: 0,
        w: pageSize.width,
        h: pageSize.height,
        color: colors.primary,
      },
    ],
  };

  const canvasElements = isEvenPage
    ? drawEvenPageBackground(pageSize, colors)
    : drawOddPageBackground(pageSize, colors);

  background.canvas.push(...canvasElements);

  return background;
}

function drawEvenPageBackground(
  pageSize: PageSize,
  colors: CompanyColorsType,
): Array<any> {
  return [
    {
      type: 'polyline',
      closePath: true,
      points: [
        { x: 0, y: 171 },
        { x: pageSize.width, y: 271 },
        { x: pageSize.width, y: pageSize.height - 14 },
        { x: 0, y: pageSize.height - 14 },
        { x: 0, y: 171 },
      ],
      color: colors.secondary,
    },
    {
      type: 'rect',
      x: CONTAINER_X_MARGIN,
      y: CONTAINER_Y_MARGIN,
      r: EVEN_PAGE_BORDER_TOP_RADIUS,
      w: pageSize.width - CONTAINER_X_MARGIN * 2,
      h: CONTAINER_Y_MARGIN,
      color: '#FFF',
    },
    {
      type: 'rect',
      x: CONTAINER_X_MARGIN,
      y: CONTAINER_Y_MARGIN + CONTAINER_Y_MARGIN / 2,
      r: EVEN_PAGE_BORDER_BOTTOM_RADIUS,
      w: pageSize.width - 50,
      h: pageSize.height - CONTAINER_Y_MARGIN * 2 - CONTAINER_Y_MARGIN / 2,
      color: '#FFF',
    },
    {
      type: 'rect',
      x: 149,
      y: 60,
      w: 1,
      h: 492,
      color: '#DFDFDF',
    },
  ];
}

function drawOddPageBackground(
  pageSize: PageSize,
  colors: CompanyColorsType,
): Array<any> {
  return [
    {
      type: 'polyline',
      lineWidth: 3,
      closePath: true,
      points: [
        { x: 0, y: 14 },
        { x: pageSize.width, y: 14 },
        { x: pageSize.width, y: pageSize.height - 171 },
        { x: 0, y: 271 },
        { x: 0, y: 14 },
      ],
      color: colors.secondary,
    },
    {
      type: 'rect',
      x: CONTAINER_X_MARGIN,
      y: CONTAINER_Y_MARGIN,
      r: ODD_PAGE_BORDER_TOP_RADIUS,
      w: pageSize.width - CONTAINER_X_MARGIN * 2,
      h: pageSize.height - CONTAINER_Y_MARGIN * 2 - CONTAINER_Y_MARGIN / 2,
      color: '#FFF',
    },
    {
      type: 'rect',
      x: CONTAINER_X_MARGIN,
      y: pageSize.height - CONTAINER_Y_MARGIN * 2,
      r: ODD_PAGE_BORDER_BOTTOM_RADIUS,
      w: pageSize.width - CONTAINER_X_MARGIN * 2,
      h: CONTAINER_Y_MARGIN,
      color: '#FFF',
    },
    {
      type: 'rect',
      x: 149,
      y: 60,
      w: 1,
      h: 492,
      color: '#DFDFDF',
    },
  ];
}
