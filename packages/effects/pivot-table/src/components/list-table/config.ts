export const defaultOptions = {
  autoFillWidth: true,
  autoWrapText: true,
  columns: [],
  dragHeaderMode: 'all',
  emptyTip: {
    text: '暂无数据',
  },
  hover: {
    highlightMode: 'cross',
  },
  records: [],
  theme: {
    // 自定义hover交互的样式
    bodyStyle: {
      borderColor: '#f0f0f0',
      color: '#666',
      // hover: {
      //   cellBgColor: '#FFC0CB',
      // },
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
};
