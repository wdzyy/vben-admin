import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'userName',
    label: '用户账号',
  },
  {
    component: 'Input',
    fieldName: 'phonenumber',
    label: '手机号码',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    title: '用户账号',
    field: 'userName',
    minWidth: 100,
  },
  {
    title: '用户昵称',
    field: 'nickName',
    minWidth: 130,
  },
  {
    title: '邮箱',
    field: 'email',
    minWidth: 150,
  },
  {
    title: '手机号',
    field: 'phonenumber',
    minWidth: 120,
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    resizable: false,
    width: 170,
  },
];
