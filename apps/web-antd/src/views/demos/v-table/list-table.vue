<script lang="ts" setup>
import type { ListTableOptions } from '@zyy/pivot-table';

import { onMounted, ref } from 'vue';

import { ListTable as ZListTable } from '@zyy/pivot-table';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';

import '@zyy/pivot-table/lib/style.css';

const options = ref<ListTableOptions>({
  columns: [
    {
      field: '230517143221027',
      title: 'Order ID',
      width: 'auto',
    },
    {
      field: '230517143221030',
      title: 'Customer ID',
      width: 'auto',
    },
    {
      field: '230517143221032',
      title: 'Product Name',
      width: 250,
    },
    {
      field: '230517143221023',
      title: 'Category',
      width: 'auto',
    },
    {
      field: '230517143221034',
      title: 'Sub-Category',
      width: 'auto',
    },
    {
      field: '230517143221037',
      title: 'Region',
      width: 'auto',
    },
    {
      field: '230517143221024',
      title: 'City',
      width: 'auto',
    },
    {
      field: '230517143221029',
      title: 'Order Date',
      width: 'auto',
    },
    {
      field: '230517143221042',
      title: 'Quantity',
      width: 'auto',
    },
    {
      field: '230517143221040',
      title: 'Sales',
      width: 'auto',
    },
    {
      field: '230517143221041',
      title: 'Profit',
      width: 'auto',
    },
  ],
  pagination: {
    currentPage: 0,
    perPageCount: 100,
    totalCount: 10_000,
  },
  records: [],
});

const zListRef = ref<any>();
const data = ref<any>([]);
const onSubmit = (values: Record<string, any>) => {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
  if (zListRef.value) zListRef.value.setData(data.value);
};
const onReset = (values: Record<string, any>) => {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
  if (zListRef.value) zListRef.value.setData([]);
};
const [QueryForm] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 重置函数
  handleReset: onReset,
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  layout: 'horizontal',
  // 使用 tailwindcss grid布局
  // 水平布局，label和input在同一行
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入款号',
      },
      // 字段名
      fieldName: 'styleNo',
      // 界面显示的label
      label: '款号',
    },
    {
      component: 'InputPassword',
      fieldName: 'styleName',
      label: '款名',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'moNo',
      label: '制单号',
    },
    {
      component: 'DatePicker',
      fieldName: 'datePicker',
      label: '日期选择框',
    },
  ],
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    text: '查询',
  },
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

const getListData = () => {
  fetch(
    'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_list100.json',
  )
    .then((res) => res.json())
    .then((resp) => {
      data.value = resp;
      options.value!.pagination!.totalCount = resp.length;
    });
};

onMounted(() => {
  getListData();
});
</script>

<template>
  <div class="mx-4 mt-4 rounded-md bg-white p-4 pb-0">
    <QueryForm />
    <ZListTable
      ref="zListRef"
      :default-page-size="100"
      :options="options as ListTableOptions"
      :page-size-options="[100, 200, 300, 400, 10000]"
      show-less-items
    />
  </div>
</template>
