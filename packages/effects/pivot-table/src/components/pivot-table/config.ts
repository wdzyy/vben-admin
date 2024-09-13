export const defaultOptions = {
  columnResizeMode: 'all', // 列宽调整模式
  columns: [],
  corner: {
    titleOnDimension: 'all',
  },
  dataConfig: {
    totals: {
      column: {
        // grandTotalLabel: '合计',
        showGrandTotals: false,
        showGrandTotalsOnLeft: true,
        showSubTotals: false,
        showSubTotalsOnLeft: true,
        // subTotalLabel: '小计',
        subTotalsDimensions: ['styleNo'],
      },
      row: {
        // grandTotalLabel: '合计',
        showGrandTotals: false,
        showGrandTotalsOnTop: true,
        showSubTotals: false,
        showSubTotalsOnTop: true,
        // subTotalLabel: '小计',
        subTotalsDimensions: ['processDate'],
      },
    },
  },
  dragHeaderMode: 'all', // 拖拽表头模式
  emptyTip: true,

  enableDataAnalysis: true,
  hover: {
    highlightMode: 'cross',
  },
  indicators: [],
  indicatorsAsCol: true,
  keyboardOptions: {
    copySelected: true, // 是否支持复制选中的单元格
    selectAllOnCtrlA: true, // 是否支持Ctrl+A全选
  },
  records: [],
  rowResizeMode: 'all', // 行高调整模式
  rows: [],
  theme: {
    // 自定义hover交互的样式
    bodyStyle: {
      borderColor: '#f0f0f0',
      color: '#666',
      hover: {
        cellBgColor: '#FFC0CB',
        inlineColumnBgColor: '#F3F8FF', // 绿黄色
        inlineRowBgColor: '#F3F8FF', // 金色
      },
    },
    // 列宽调整样式
    columnResize: {
      bgColor: 'lightgray',
      lineColor: 'blue',
      lineWidth: 2,
      width: 10,
    },

    cornerHeaderStyle: {
      bgColor: '#f5f6f8',
      borderColor: '#f0f0f0',
      fontSize: 16,
    },
    // 拖拽换位样式
    dragHeaderSplitLine: {
      lineColor: 'red',
      lineWidth: 2,
      shadowBlockColor: 'rgba(255,0,0,0.3)',
    },
    frameStyle: {
      borderColor: '#f0f0f0',
    },
    // 表头样式
    headerStyle: {
      bgColor: '#f5f6f8',
      borderColor: '#f0f0f0',
      color: '#000',
      hover: {
        cellBgColor: '#F3F8FF',
        cellBorderColor: '#003fff',
        inlineColumnBgColor: '#F3F8FF',
        inlineRowBgColor: '#F3F8FF',
      },
    },
    rowHeaderStyle: {
      bgColor: '#f5f6f8',
      borderColor: '#f0f0f0',
      fontSize: 16,
      hover: {
        cellBgColor: '#F3F8FF',
        cellBorderColor: '#003fff',
        inlineColumnBgColor: '#F3F8FF',
        inlineRowBgColor: '#F3F8FF',
      },
    },
    // 选中单元格样式
    selectionStyle: {
      cellBgColor: 'rgba(153,0,255,0.2)',
      cellBorderColor: '#9900ff',
      cellBorderLineWidth: 2,
    },
  },
  //   },
  widthMode: 'autoWidth', // 宽度模式
};
