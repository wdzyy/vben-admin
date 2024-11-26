import type { VxeColumnSlotTypes } from 'vxe-pc-ui';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export interface PullDownRecord {
  [key: string]: any;
}

export interface TablePullDownProps {
  // 数据源API
  api: (params: Record<string, any>) => Promise<{ items: PullDownRecord[] }>;
  // 是否多选
  multiple?: boolean;
  // 当前行列信息
  params: {
    column: { field: string };
    row: PullDownRecord;
  };
  // 查询表单配置
  querySchema?: VbenFormProps['schema'];
  // 选中值的字段
  selectedField?: string;
  // 表格列配置
  tableColumns?: VxeGridProps['columns'];
  // 自定义表格配置
  gridOptions?: Partial<VxeGridProps>;
}

export type ConfirmEvent = VxeColumnSlotTypes.EditSlotParams;
