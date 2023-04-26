function mapTableBodies(innerTableCell, maxWidth, usedWidth) {
  const findInlineHeight = this.findInlineHeight(
    innerTableCell,
    maxWidth,
    usedWidth,
  );

  usedWidth = findInlineHeight.width;
  return findInlineHeight.height;
}

function findInlineHeight(cell, maxWidth, usedWidth = 0) {
  const calcLines = (inlines) => {
    if (!inlines)
      return {
        height: 0,
        width: 0,
      };
    let currentMaxHeight = 0;
    let lastHadLineEnd = false;
    for (const currentNode of inlines) {
      usedWidth += currentNode.width;
      if (usedWidth > maxWidth || lastHadLineEnd) {
        currentMaxHeight += currentNode.height;
        usedWidth = currentNode.width;
      } else {
        currentMaxHeight = Math.max(currentNode.height, currentMaxHeight);
      }
      lastHadLineEnd = !!currentNode.lineEnd;
    }
    return {
      height: currentMaxHeight,
      width: usedWidth,
    };
  };
  if (cell._offsets) {
    usedWidth += cell._offsets.total;
  }
  if (cell._inlines && cell._inlines.length) {
    return calcLines(cell._inlines);
  } else if (cell.stack && cell.stack[0]) {
    return cell.stack
      .map((item) => {
        return findInlineHeight(item, maxWidth);
      })
      .reduce((prev, next) => {
        return {
          height: prev.height + next.height,
          width: Math.max(prev.width + next.width),
        };
      });
  } else if (cell.table) {
    let currentMaxHeight = 0;
    for (const currentTableBodies of cell.table.body) {
      const innerTableHeights = currentTableBodies.map(mapTableBodies);
      currentMaxHeight = Math.max(...innerTableHeights, currentMaxHeight);
    }
    return {
      height: currentMaxHeight,
      width: usedWidth,
    };
  } else if (cell._height) {
    usedWidth += cell._width;
    return {
      height: cell._height,
      width: usedWidth,
    };
  }

  return {
    height: null,
    width: usedWidth,
  };
}

export function applyVerticalAlignment(node, rowIndex, align) {
  const allCellHeights = node.table.body[rowIndex].map(
    (innerNode, columnIndex) => {
      const mFindInlineHeight = findInlineHeight(
        innerNode,
        node.table.widths[columnIndex]._calcWidth,
      );
      return mFindInlineHeight.height;
    },
  );
  const maxRowHeight = Math.max(...allCellHeights);
  node.table.body[rowIndex].forEach((cell, ci) => {
    if (allCellHeights[ci] && maxRowHeight > allCellHeights[ci]) {
      let topMargin;

      let cellAlign = align;
      if (Array.isArray(align)) {
        cellAlign = align[ci];
      }

      if (cellAlign === 'bottom') {
        topMargin = maxRowHeight - allCellHeights[ci];
      } else if (cellAlign === 'center') {
        topMargin = (maxRowHeight - allCellHeights[ci]) / 2;
      }

      if (topMargin) {
        if (cell._margin) {
          cell._margin[1] = topMargin;
        } else {
          cell._margin = [0, topMargin, 0, 0];
        }
      }
    }
  });
}
