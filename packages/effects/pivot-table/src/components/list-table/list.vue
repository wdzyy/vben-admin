<script lang="ts" setup>
import type { ListTableOptions } from './types';

import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
} from 'vue';

import { ListTable } from '@visactor/vtable';
import { Pagination } from 'ant-design-vue';
import { defaultsDeep } from 'lodash-es';

import { defaultOptions } from './config';

// 定义组件属性
const props = defineProps<{
  height?: number | string;
  options: ListTableOptions;
  width?: number | string;
}>();

const defaultWidth: string = '100%';
const defaultHeight = ref<string>('calc(100vh - 310px)');
const formatSize = (size: number | string | undefined, defaultSize: string) => {
  return size ? (typeof size === 'number' ? `${size}px` : size) : defaultSize;
};
const tableWidth = computed(() => formatSize(props.width, defaultWidth));
const tableHeight = computed(() =>
  formatSize(props.height, defaultHeight.value),
);

const listWrapper = ref<HTMLElement>();
const listRef = ref<HTMLElement>();
const tableInstance = shallowRef();

const option = ref<ListTableOptions>({});
const currentPage = ref<number>(1);

// 设置表格数据
const setData = (records: any) => {
  tableInstance.value.setRecords(records);
};

/**
 * 翻页
 */
const handlePageChange = (page: number, pageSize: number) => {
  currentPage.value = page;
  tableInstance.value.updatePagination({
    currentPage: page - 1,
    perPageCount: pageSize,
  });
};

// 初始化选项和状态
const initializeOptionsAndState = () => {
  // 合并配置
  option.value = defaultsDeep(props.options, defaultOptions); // 合并配置
};
// 监听窗口大小变化，重新计算表格高度
const updateHeight = () => {
  if (listRef.value && listWrapper.value) {
    const listTableRect = listRef.value.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    defaultHeight.value = `calc(100vh - ${listTableRect.top}px - ${viewportHeight - listTableRect.bottom}px)`;
  }
};
// 初始化表格实例
const initializeTableInstance = () => {
  if (listRef.value) {
    tableInstance.value = new ListTable(
      listRef.value,
      option.value as ListTableOptions,
    );
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
  updateHeight,
});
</script>

<template>
  <div ref="listWrapper" class="list-table">
    <div
      ref="listRef"
      :style="{ width: tableWidth, height: tableHeight }"
      class="list-table"
    ></div>
    <div class="pagination">
      <Pagination
        v-if="option.pagination"
        v-model:current="currentPage"
        :="$attrs"
        :total="option.pagination.totalCount"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}
</style>
