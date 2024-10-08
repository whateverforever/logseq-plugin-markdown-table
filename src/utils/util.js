import { DEFAULT_TABLE } from './contants'

export const stringToSlateValue = (str = '') => {
  str = str || DEFAULT_TABLE
  // 将 [:br] 转为换行符
  const _arr = str.trim().split('\n').filter(Boolean).map(_str => _str.replaceAll('[:br]', '\n'))
  const contentArr = [_arr[0]].concat(_arr.slice(2))
  const res = contentArr.map(rowStr => {
    const rowArr = rowStr.trim().split('|')
    return rowArr.slice(1, rowArr.length - 1)
  })
  return createTableNode(res)
}

export const slateValueToString = (slateVal) => {
  // Calculate the maximum width for each column
  const columnWidths = slateVal.children[0].children.map((_, colIndex) => {
    return Math.max(...slateVal.children.map(row => 
      row.children[colIndex].children[0].text?.replaceAll('\n', '[:br]').length || 0
    ));
  });
  console.log('Debug: Column widths:', columnWidths);

  let rowStrs = Array.from(slateVal.children, (row) => {
    const cells = Array.from(row.children, (cell, index) => {
      const cellText = cell.children[0].text?.replaceAll('\n', '[:br]') || '';
      return cellText.padEnd(columnWidths[index]);
    }).join(' | ');
    return `| ${cells} |`;
  });

  // Create the separator row
  const separatorRow = `| ${columnWidths.map(width => '-'.repeat(width)).join(' | ')} |`;
  rowStrs.splice(1, 0, separatorRow);

  // Add the preamble
  const preamble = '#+attr_html: :class monospace-table';
  return `${preamble}\n${rowStrs.join('\n')}`;
}

const createRow = (cellText) => {
  const newRow = Array.from(cellText, (value) => createTableCell(value))
  return {
    type: "table-row",
    children: newRow
  }
}

const createTableCell = (text) => {
  return {
    type: "table-cell",
    children: [{ text }]
  }
}

export const createTableNode = (cellText) => {
  const tableChildren = Array.from(cellText, (value) => createRow(value))
  let tableNode = { type: "table", children: tableChildren }
  return tableNode
}