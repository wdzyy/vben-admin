import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { getPopupContainer } from '@vben/utils';

import { DictEnum } from '#/constants';
import { getDictOptions } from '#/utils/dict';
import { renderDict } from '#/utils/render';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'noticeTitle',
    label: '公告标题',
  },
  {
    component: 'Input',
    fieldName: 'createBy',
    label: '创建人',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_NOTICE_TYPE),
    },
    fieldName: 'noticeType',
    label: '公告类型',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    title: '公告标题',
    field: 'noticeTitle',
    minWidth: 200,
  },
  {
    title: '公告类型',
    field: 'noticeType',
    minWidth: 120,
    slots: {
      default: ({ row }) => {
        return renderDict(row.noticeType, DictEnum.SYS_NOTICE_TYPE);
      },
    },
  },
  {
    title: '状态',
    field: 'status',
    minWidth: 120,
    slots: {
      default: ({ row }) => {
        return renderDict(row.status, DictEnum.SYS_NOTICE_STATUS);
      },
    },
  },
  {
    title: '创建人',
    field: 'createByName',
    minWidth: 150,
  },
  {
    title: '创建时间',
    field: 'createTime',
    minWidth: 160,
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    resizable: false,
    width: 120,
  },
];

export const modalSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'noticeId',
    label: '主键',
  },
  {
    component: 'Input',
    fieldName: 'noticeTitle',
    label: '公告标题',
    rules: 'required',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      class: 'grid-cols-2',
      options: [
        { label: '正常', value: '0' },
        { label: '关闭', value: '1' },
      ],
      optionType: 'button',
    },
    defaultValue: '0',
    fieldName: 'status',
    label: '公告状态',
    rules: 'required',
    formItemClass: 'col-span-1',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      class: 'grid-cols-2',
      options: [
        { label: '通知', value: '1' },
        { label: '公告', value: '2' },
      ],
      optionType: 'button',
    },
    defaultValue: '1',
    fieldName: 'noticeType',
    label: '公告类型',
    rules: 'required',
    formItemClass: 'col-span-1',
  },
  {
    component: 'RichTextarea',
    componentProps: {
      width: '100%',
    },
    fieldName: 'noticeContent',
    label: '公告内容',
    rules: 'required',
  },
];
