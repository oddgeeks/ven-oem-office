export function drawLegend(products: any[]) {
  const result = {
    layout: {
      // having hLineWidth greater than 0, dynamic page break calculation doesn't work
      hLineWidth: () => 0,
      hLineColor: () => '#fff',
      vLineWidth: () => 0,
      paddingLeft: () => 0,
      paddingRight: () => 0,
    },
    table: {
      body: [],
    },
  };

  for (const product of products) {
    result.table.body.push([
      {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 8,
            h: 8,
            r: 0,
            color: product.color,
          },
        ],
      },
      {
        text: product.productName,
        fontSize: 6,
        margin: [4, 1, 0, 0],
      },
    ]);
  }

  return result;
}
