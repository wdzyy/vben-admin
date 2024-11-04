import { h, type Ref } from 'vue';

import {
  setupVbenVxeTable,
  useVbenVxeGrid,
  type VxeGridDefines,
} from '@vben/plugins/vxe-table';

import { Button, Image } from 'ant-design-vue';

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
      renderDefault(_renderOpts, params) {
        const { column, row } = params;
        return h(Image, { src: row[column.field] });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          Button,
          { size: 'small', type: 'link' },
          { default: () => props?.text },
        );
      },
    });

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';

/**
 * 通用的表格复选框是否选中事件
 * @param checked 是否选中
 * @returns function
 */
export function tableCheckboxEvent(checked: Ref<boolean>) {
  const event: (params: VxeGridDefines.CheckboxChangeEventParams) => void = (
    params,
  ) => {
    checked.value = params.$table.getCheckboxRecords().length > 0;
  };

  return event;
}
