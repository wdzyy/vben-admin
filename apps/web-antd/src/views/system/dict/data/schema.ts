import type { VxeGridProps } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { getPopupContainer } from '@vben/utils';

import { type FormSchemaGetter } from '#/adapter/form';
import { dictOptionSelectList } from '#/api/system/dict/dict-type';
import { renderDictTag } from '#/utils/render';

/**
 * updateSchema无法赋值
 * TODO: 使用updateSchema重构
 */
const dictTypeOptions = reactive<{ label: string; value: string }[]>([]);
(async () => {
  const resp = await dictOptionSelectList();
  const options = resp.map((item) => ({
    label: item.dictName,
    value: item.dictType,
  }));
  dictTypeOptions.push(...options);
})();

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Select',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    componentProps: {
      getPopupContainer,
      options: dictTypeOptions,
    },
    fieldName: 'dictType',
    label: '字典类型',
  },
  {
    component: 'Input',
    fieldName: 'dictLabel',
    label: '字典标签',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    title: '字典标签',
    field: 'cssClass',
    slots: {
      default: ({ row }) => {
        const { dictValue } = row;
        return renderDictTag(dictValue, [row as any]);
      },
    },
  },
  {
    title: '字典键值',
    field: 'dictValue',
  },
  {
    title: '字典排序',
    field: 'dictSort',
  },
  {
    title: '备注',
    field: 'remark',
  },
  {
    title: '创建时间',
    field: 'createTime',
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    width: 180,
  },
];

export const drawerSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'dictCode',
  },
  {
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    fieldName: 'dictType',
    label: '字典类型',
  },
  {
    component: 'Input',
    fieldName: 'listClass',
    label: '标签样式',
  },
  {
    component: 'Input',
    fieldName: 'dictLabel',
    label: '数据标签',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'dictValue',
    label: '数据键值',
    rules: 'required',
  },
  {
    component: 'Textarea',
    componentProps: {
      placeholder: '可使用tailwind类名 如bg-blue w-full h-full等',
    },
    fieldName: 'cssClass',
    formItemClass: 'items-baseline',
    help: '标签的css样式, 可添加已经编译的css类名',
    label: 'css类名',
  },
  {
    component: 'InputNumber',
    fieldName: 'dictSort',
    label: '显示排序',
    rules: 'required',
  },
  {
    component: 'Textarea',
    fieldName: 'remark',
    formItemClass: 'items-baseline',
    label: '备注',
  },
];
