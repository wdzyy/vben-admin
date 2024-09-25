import type {
  IColumnDimension,
  IIndicator,
  IRowDimension,
  PivotTableConstructorOptions,
} from '@visactor/vtable/es/ts-types';

// 导出所有导入的类型
// export * from '@visactor/vtable/es/ts-types';

export type CheckedType = boolean | number | string;
export interface Options {
  label: string;
  value: string;
  selected: boolean;
}
export interface OptionItem {
  title?: string;
  dimensionKey?: string;
  indicatorKey?: string;
  [key: string]: any; // 允许其他属性
}
export interface StateInterFace {
  rowCheckedList: CheckedType[];
  columnCheckedList: CheckedType[];
  indicatorsCheckedList: CheckedType[];
  indicatorsAsCol: CheckedType;
}

export type Row = {
  selected: boolean;
} & IRowDimension;
export type Column = {
  selected: boolean;
} & IColumnDimension;
export type Indicator = {
  selected: boolean;
} & IIndicator;
export type PivotTableOptions = {
  columns: Column[];
  indicators: Indicator[];
  rows: Row[];
} & PivotTableConstructorOptions;
