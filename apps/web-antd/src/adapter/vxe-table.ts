import type { VxeGridDefines } from '@vben/plugins/vxe-table';

import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Button, Image } from 'ant-design-vue';

import { componentMap } from '#/components/table/component-map';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'items',
            total: 'total',
            list: 'items',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        rowConfig: {
          // 鼠标移入行显示 hover 样式
          isHover: true,
          // 点击行高亮
          isCurrent: true,
        },
        // 右上角工具栏
        toolbarConfig: {
          // 自定义列
          custom: {
            icon: 'vxe-icon-setting',
          },
          // 刷新
          refresh: true,
          zoom: true,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        return h(Image, { src: row[column.field] });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          Button,
          { size: 'small', type: 'link' },
          { default: () => props?.text },
        );
      },
    });

    // 注册@/components/view/下面所有列渲染器
    componentMap.forEach((componentName, key) => {
      // 创建一个渲染器
      vxeUI.renderer.add(key, {
        renderTableEdit(renderOpts, params) {
          const { row, column } = params;
          const { attrs, props, events } = renderOpts;
          return h(componentName, {
            params,
            ...attrs,
            ...props,
            ...events,
            value: row[column.field],
            'onUpdate:value': (value: any) => {
              row[column.field] = value;
            },
          });
        },
        // 可编辑显示模板
        renderTableCell(_renderOpts, params) {
          const { row, column } = params;
          return h('span', {}, { default: () => row[column.field] });
        },
      });
    });

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';

/**
 * 判断vxe-table的复选框是否选中
 * @param tableApi api
 * @returns boolean
 */
export function vxeCheckboxChecked(
  tableApi: ReturnType<typeof useVbenVxeGrid>[1],
) {
  return tableApi?.grid?.getCheckboxRecords?.()?.length > 0;
}

/**
 * 通用的vxe-table排序事件 支持单/多字段排序
 * @param tableApi api
 * @param sortParams 排序参数
 */
export function vxeSortEvent(
  tableApi: ReturnType<typeof useVbenVxeGrid>[1],
  sortParams: VxeGridDefines.SortChangeEventParams,
) {
  const { sortList } = sortParams;
  // 这里是排序取消 length为0 就不传参数了
  if (sortList.length === 0) {
    tableApi.query();
    return;
  }
  // 支持单/多字段排序
  const orderByColumn = sortList.map((item) => item.field).join(',');
  const isAsc = sortList.map((item) => item.order).join(',');
  tableApi.query({ orderByColumn, isAsc });
}
