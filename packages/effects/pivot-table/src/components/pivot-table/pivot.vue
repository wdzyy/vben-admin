<script lang="ts" setup>
import type {
  CheckedType,
  Column,
  Indicator,
  OptionItem,
  Options,
  PivotTableOptions,
  Row,
  StateInterFace,
} from './types';

import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  shallowRef,
} from 'vue';

import { PivotTable } from '@visactor/vtable';
import { CheckboxGroup, Divider, Switch } from 'ant-design-vue';
import { cloneDeep, defaultsDeep } from 'lodash-es';

import { defaultOptions } from './config';

// 定义组件属性
const props = defineProps<{
  height?: number | string;
  options: PivotTableOptions;
  width?: number | string;
}>();

// 定义响应式变量
const pivotWrapper = ref<HTMLElement>();
const pivotRef = ref<HTMLElement>();
const tableInstance = shallowRef();
const option = ref<PivotTableOptions>({
  columns: [],
  indicators: [],
  rows: [],
});
const state = reactive<StateInterFace>({
  columnCheckedList: [],
  indicatorsAsCol: true,
  indicatorsCheckedList: [],
  rowCheckedList: [],
});
const rowsOptions = ref<Options[]>([]);
const columnsOptions = ref<Options[]>([]);
const indicatorsOptions = ref<Options[]>([]);

const originRows = ref<Row[]>([]);
const originColumns = ref<Column[]>([]);
const originIndicators = ref<Indicator[]>([]);

const showColGrandTotals = ref<boolean>(false);
const showColSubTotals = ref<boolean>(false);
const showRowGrandTotals = ref<boolean>(false);
const showRowSubTotals = ref<boolean>(false);

const defaultWidth: string = '100%';
const defaultHeight = ref<string>('calc(100vh - 310px)');
const formatSize = (size: number | string | undefined, defaultSize: string) => {
  return size ? (typeof size === 'number' ? `${size}px` : size) : defaultSize;
};
const tableWidth = computed(() => formatSize(props.width, defaultWidth));
const tableHeight = computed(() =>
  formatSize(props.height, defaultHeight.value),
);

// 获取选项列表
const getOptions = <T extends OptionItem>(
  list: T[],
  labelKey: keyof T = 'title',
  valueKey: keyof T = 'dimensionKey',
): Options[] => {
  return list.map((item) => ({
    label: item[labelKey],
    selected: item.selected,
    value: item[valueKey],
  }));
};

// 改变数据行列转换
const changeIndicatorsAsCol = (checked: CheckedType) => {
  option.value.indicatorsAsCol = checked as boolean;
  tableInstance.value.updateOption(option.value);
};

// 切换显示的行
const changeRow = (list: CheckedType[]) => {
  state.rowCheckedList = list;
  option.value.rows = originRows.value.filter((item: Row) =>
    state.rowCheckedList.includes(item.dimensionKey),
  );

  // 当只有一个行维度时，不显示小计 start
  const subTotalsDimensions =
    option.value?.dataConfig?.totals?.row?.subTotalsDimensions ?? [];
  const dataConfig = option.value?.dataConfig;

  if (dataConfig?.totals?.row) {
    dataConfig.totals.row.subTotalsDimensions =
      list.length === 1 && list[0] === subTotalsDimensions[0]
        ? []
        : [originRows.value[0]!.dimensionKey];
  } else {
    console.warn('dataConfig.totals.row 未定义');
  }
  // 当只有一个行维度时，不显示小计 end

  tableInstance.value.updateOption(option.value);
};

// 切换显示的列
const changeColumn = (list: CheckedType[]) => {
  state.columnCheckedList = list;
  option.value.columns = originColumns.value.filter((item: Column) =>
    state.columnCheckedList.includes(item.dimensionKey),
  );

  // 当只有一个列维度时，不显示小计 start
  const subTotalsDimensions =
    option.value?.dataConfig?.totals?.column?.subTotalsDimensions ?? [];
  const dataConfig = option.value?.dataConfig;

  if (dataConfig?.totals?.column) {
    dataConfig.totals.column.subTotalsDimensions =
      list.length === 1 && list[0] === subTotalsDimensions[0]
        ? []
        : [originColumns.value[0]!.dimensionKey];
  } else {
    console.warn('dataConfig.totals.column 未定义');
  }
  // 当只有一个列维度时，不显示小计 end

  tableInstance.value.updateOption(option.value);
};

// 切换显示的指标
const changeIndicators = (list: CheckedType[]) => {
  state.indicatorsCheckedList = list;
  option.value.indicators = originIndicators.value.filter((item: Indicator) =>
    state.indicatorsCheckedList.includes(item.indicatorKey),
  );
  tableInstance.value.updateOption(option.value);
};

// 改变显示小计和总计
const changeShowTotals = () => {
  const dataConfig = option.value?.dataConfig?.totals;

  if (!dataConfig) {
    return console.warn('dataConfig 未定义');
  }
  const { column, row } = dataConfig;

  if (row) {
    row.showGrandTotals = showRowGrandTotals.value;
    row.showSubTotals = showRowSubTotals.value;
  } else {
    console.warn('row 未定义');
  }

  if (column) {
    column.showGrandTotals = showColGrandTotals.value;
    column.showSubTotals = showColSubTotals.value;
  } else {
    console.warn('column 未定义');
  }

  tableInstance.value.updateOption(option.value);
};

// 设置表格数据
const setData = (records: any) => {
  tableInstance.value.setRecords(records);
};

// 初始化选项和状态
const initializeOptionsAndState = () => {
  // 合并配置
  option.value = defaultsDeep(
    props.options,
    defaultOptions,
  ) as PivotTableOptions; // 合并配置
  // 克隆原始数据
  originRows.value = cloneDeep(option.value.rows) as Row[]; // 原始数据行
  originColumns.value = cloneDeep(option.value.columns) as Column[]; // 原始数据列
  originIndicators.value = cloneDeep(option.value.indicators) as Indicator[]; // 原始数据列
  // 获取选项用于渲染复选框
  rowsOptions.value = getOptions(originRows.value as Row[]); // 行选项，用于渲染复选框
  columnsOptions.value = getOptions(originColumns.value as Column[]); // 列选项，用于渲染复选框
  indicatorsOptions.value = getOptions(
    originIndicators.value as Indicator[],
    'title',
    'indicatorKey',
  ); // 指标选项，用于渲染复选框

  // 过滤选中的项
  option.value.rows = (option.value.rows as Row[])!.filter(
    (item) => item.selected,
  ); // 默认选中所有行,显示所有配置的行
  option.value.columns = (option.value.columns as Column[])!.filter(
    (item) => item.selected,
  ); // 默认选中所有行,显示所有配置的行
  option.value.indicators = (option.value.indicators as Indicator[])!.filter(
    (item) => item.selected,
  ); // 默认选中所有行,显示所有配置的行

  // 更新状态
  state.rowCheckedList = rowsOptions.value
    .filter((item) => item.selected)
    .map((item) => item.value); // 默认选中所有行,显示所有配置的行
  state.columnCheckedList = columnsOptions.value
    .filter((item) => item.selected)
    .map((item) => item.value); // 默认选中所有列，显示所有配置的列
  state.indicatorsCheckedList = indicatorsOptions.value
    .filter((item) => item.selected)
    .map((item) => item.value); // 默认选中所有列，显示所有配置的列
};

// 监听窗口大小变化，重新计算表格高度
const updateHeight = () => {
  if (pivotRef.value && pivotWrapper.value) {
    const pivotTableRect = pivotRef.value.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    defaultHeight.value = `calc(100vh - ${pivotTableRect.top}px - ${viewportHeight - pivotTableRect.bottom}px)`;
  }
};
// 初始化表格实例
const initializeTableInstance = () => {
  if (pivotRef.value) {
    tableInstance.value = new PivotTable(pivotRef.value, option.value);
  }
  window.addEventListener('resize', updateHeight);
  updateHeight(); // 初始化时计算一次高度
};

// 生命周期钩子
onBeforeMount(initializeOptionsAndState);
onMounted(initializeTableInstance);
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeight);
});

defineExpose({
  setData,
});
</script>

<template>
  <div ref="pivotWrapper" class="pivot-table">
    <div>
      <div class="flex flex-wrap items-center gap-2">
        <div>
          指标显示:
          <Switch
            v-model:checked="state.indicatorsAsCol"
            checked-children="列"
            un-checked-children="行"
            @change="changeIndicatorsAsCol"
          />
        </div>
        <Divider type="vertical" />
        <div>
          行:
          <CheckboxGroup
            v-model:value="state.rowCheckedList"
            :options="rowsOptions"
            @change="changeRow"
          />
        </div>
        <Divider type="vertical" />
        <div>
          列:
          <CheckboxGroup
            v-model:value="state.columnCheckedList"
            :options="columnsOptions"
            @change="changeColumn"
          />
        </div>
        <Divider type="vertical" />
        <div>
          指标:
          <CheckboxGroup
            v-model:value="state.indicatorsCheckedList"
            :options="indicatorsOptions"
            @change="changeIndicators"
          />
        </div>
      </div>
      <Divider />
      <div class="mb-4 flex items-center justify-between">
        <div class="tool_left flex items-center">
          <div>
            列小计:
            <Switch
              v-model:checked="showColSubTotals"
              @change="changeShowTotals"
            />
          </div>
          <Divider type="vertical" />
          <div>
            列总计:
            <Switch
              v-model:checked="showColGrandTotals"
              @change="changeShowTotals"
            />
          </div>
          <Divider type="vertical" />
          <div>
            行小计:
            <Switch
              v-model:checked="showRowSubTotals"
              @change="changeShowTotals"
            />
          </div>
          <Divider type="vertical" />
          <div>
            行总计:
            <Switch
              v-model:checked="showRowGrandTotals"
              @change="changeShowTotals"
            />
          </div>
        </div>
        <div class="tool_right">
          <slot name="tools_right"></slot>
        </div>
      </div>
      <div
        ref="pivotRef"
        :style="{ width: tableWidth, height: tableHeight }"
        class="pivot"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pivot-table .ant-divider-horizontal {
  margin: 16px 0;
}
</style>
