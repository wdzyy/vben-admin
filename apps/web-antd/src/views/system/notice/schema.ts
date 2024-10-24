import type { VxeGridProps } from '#/adapter/vxe-table';

import { getPopupContainer } from '@vben/utils';

import { type FormSchemaGetter } from '#/adapter/form';
import { DictEnum } from '#/constants';
import { getDictOptions } from '#/utils/dict';
import { renderDictTag } from '#/utils/render';

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
  },
  {
    title: '公告类型',
    field: 'noticeType',
    width: 120,
    slots: {
      default: ({ row }) => {
        return renderDictTag(row.noticeType, [
          {
            dictCode: 14,
            dictSort: 1,
            dictLabel: '通知',
            dictValue: '1',
            dictType: 'sys_notice_type',
            cssClass: '',
            listClass: '#ffa727',
            isDefault: 'Y',
            remark: '通知',
            createTime: '2023-11-25 13:06:29',
            createBy: 'xm',
            default: false,
            status: '1',
          },
          {
            dictCode: 15,
            dictSort: 2,
            dictLabel: '公告',
            dictValue: '2',
            dictType: 'sys_notice_type',
            cssClass: '',
            listClass: '#42a5f6',
            isDefault: 'N',
            remark: '公告',
            createTime: '2023-11-25 13:06:29',
            createBy: 'xm',
            default: false,
            status: '2',
          },
        ]);
      },
    },
  },
  {
    title: '状态',
    field: 'status',
    width: 120,
    slots: {
      default: ({ row }) => {
        return renderDictTag(row.status, [
          {
            dictCode: 16,
            dictSort: 1,
            dictLabel: '正常',
            dictValue: '0',
            dictType: 'sys_notice_status',
            cssClass: '#4cb050',
            listClass: 'primary',
            isDefault: 'Y',
            remark: '正常状态',
            createTime: '2023-11-25 13:06:29',
            createBy: 'xm',
            default: false,
            status: '0',
          },
          {
            dictCode: 17,
            dictSort: 2,
            dictLabel: '关闭',
            dictValue: '1',
            dictType: 'sys_notice_status',
            cssClass: '#eb4165',
            listClass: 'danger',
            isDefault: 'N',
            remark: '关闭状态',
            createTime: '2023-11-25 13:06:29',
            createBy: 'xm',
            default: false,
            status: '1',
          },
        ]);
      },
    },
  },
  {
    title: '创建人',
    field: 'createByName',
    width: 150,
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
    formItemClass: 'col-span-2',
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
  },
  {
    component: 'RichTextarea',
    componentProps: {
      width: '100%',
    },
    fieldName: 'noticeContent',
    formItemClass: 'col-span-2',
    label: '公告内容',
    rules: 'required',
  },
];
