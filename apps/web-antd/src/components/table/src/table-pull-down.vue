<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { ConfirmEvent, TablePullDownProps } from './types';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';

import { Input, Popover } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

const props = withDefaults(defineProps<TablePullDownProps>(), {
  multiple: false,
  selectedField: undefined,
  gridOptions: () => ({}),
});

const emits = defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm', payload: ConfirmEvent): void;
}>();
const value = defineModel<string>('value');
const visible = ref<boolean>(false);
const oldValue = ref<any>(); // 原始值，取消的时候需要恢复
const currRow = ref<any>();
const currColumn = ref<any>();
const tableData = ref<any[]>([]);

const formOptions: VbenFormProps = {
  schema: [],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  // 按下回车时是否提交表单
  submitOnEnter: false,
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  collapsed: true,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
};
const fixedColumns: VxeGridProps['columns'] = [
  {
    type: 'checkbox',
    title: '',
    width: 60,
  },
];
const getCheckedListByKeys = (items: any[], keys: string[]) => {
  return items.filter((item: Recordable<any>) =>
    keys.includes(item[props.selectedField || currColumn.value.field]),
  );
};
const gridOptions: VxeGridProps<Recordable<any>> = {
  columns: [
    {
      type: 'seq',
      title: '序号',
      width: 80,
    },
  ],
  height: '350px',
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        const res = await props.api({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        if (props.multiple) {
          const keys = value.value ? value.value.split(',') : [];
          // 找到tableList中所有的key
          const checkedList = getCheckedListByKeys(res.items, keys);
          // eslint-disable-next-line no-use-before-define
          tableApi.grid.setCheckboxRow(checkedList, true);
        }
        tableData.value = res.items;
        return { items: res.items };
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: props.selectedField,
  },
  checkboxConfig: {
    highlight: true,
    checkRowKeys: value.value ? value.value.split(',') : [],
    trigger: 'cell',
  },
  pagerConfig: {
    enabled: true,
  },
  toolbarConfig: {
    // 自定义列
    custom: false,
    // 刷新
    refresh: false,
    zoom: false,
  },
  sortConfig: {
    multiple: true,
  },
  id: 'table-edit-pulldown',
};

const gridEvents: VxeGridListeners<Recordable<any>> = {
  cellClick: (params: any) => {
    if (props.multiple) {
      // 选中后，当前行设置为选中
      // eslint-disable-next-line no-use-before-define
      tableApi.grid.toggleCheckboxRow(params.row);
      return;
    }
    const row = currRow.value;
    const column = currColumn.value;
    if (column) {
      row[column.field] = props.selectedField
        ? params.row[props.selectedField]
        : params.row[column.field];
    }
    visible.value = false;
  },
};

const [Grid, tableApi] = useVbenVxeGrid({
  formOptions: props.querySchema ? formOptions : undefined,
  gridEvents,
  gridOptions,
});

const confirm = () => {
  const checkedList = tableApi.grid.getCheckboxRecords();
  const row = currRow.value;
  const column = currColumn.value;

  // 获取选中项的值
  const getFieldValue = (item: any) =>
    props.selectedField ? item[props.selectedField] : item[column.field];

  if (props.multiple) {
    // 多选模式
    row[column.field] = checkedList
      .map((element) => getFieldValue(element))
      .join(',');
    emits('confirm', {
      row,
      checkedList,
    } as any);
  }

  visible.value = false;
  tableApi.grid.clearCurrentRow();
};
const cancel = () => {
  visible.value = false;
  currRow.value[currColumn.value.field] = oldValue.value;
  if (!props.multiple) return;

  const keys = oldValue.value.split(',');

  const checkedList = getCheckedListByKeys(tableData.value, keys);

  tableApi.grid.clearCheckboxRow();
  tableApi.grid.clearCurrentRow();
  tableApi.grid.setCheckboxRow(checkedList, true);
};

const load = () => {
  const { params, tableColumns } = props;
  const { row, column } = params;
  const oldRow = cloneDeep(row);
  oldValue.value = oldRow[column.field];
  currRow.value = row;
  currColumn.value = column;
  gridOptions.columns = [
    ...(gridOptions.columns || []),
    ...(props.multiple ? fixedColumns : []),
    ...(tableColumns || []),
  ];
  if (props.querySchema) {
    formOptions.schema = props.querySchema;
  }
  tableApi.setGridOptions(gridOptions);
};

onMounted(() => {
  load();
});
</script>

<template>
  <div>
    <Popover v-model:open="visible" trigger="click">
      <template #content>
        <div class="vxe-table--ignore-clear">
          <Grid />
          <div v-if="props.multiple" class="text-right">
            <a-button class="mr-2" @click="cancel">取消</a-button>
            <a-button type="primary" @click="confirm"> 确定 </a-button>
          </div>
        </div>
      </template>
      <Input v-model:value="value" readonly />
    </Popover>
  </div>
</template>
