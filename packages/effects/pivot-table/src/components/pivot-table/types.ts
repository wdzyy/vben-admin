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

export type Row = IRowDimension & {
  selected: boolean;
};
export type Column = IColumnDimension & {
  selected: boolean;
};
export type Indicator = IIndicator & {
  selected: boolean;
};
export type PivotTableOptions = PivotTableConstructorOptions & {
  columns: Column[];
  indicators: Indicator[];
  rows: Row[];
};
