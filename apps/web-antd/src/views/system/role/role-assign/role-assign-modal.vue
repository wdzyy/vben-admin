<script setup lang="ts">
import { ref } from 'vue';
// import { useRoute } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { type VbenFormProps } from '#/adapter/form';
import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
// import { roleSelectAll, roleUnallocatedList } from '#/api/system/role';

import mockData from './role-assign-modal-data';
import { columns, querySchema } from './schema';

const emit = defineEmits<{ reload: [] }>();

const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
});

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
    // 点击行选中
    trigger: 'row',
  },
  columns: columns?.filter((item) => item.field !== 'action'),
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async () => {
        return mockData;
        /* return await roleUnallocatedList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          roleId,
          ...formValues,
        }); */
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'userId',
  },
};

const checked = ref(false);
const [BasicTable] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents: {
    checkboxChange: (e: any) => {
      checked.value = e.records.length > 0;
    },
    checkboxAll: (e: any) => {
      checked.value = e.records.length > 0;
    },
  },
});

async function handleConfirm() {
  handleCancel();
  emit('reload');
}

function handleCancel() {
  modalApi.close();
}
</script>

<template>
  <BasicModal class="h-[80%] w-[800px]" title="选择用户">
    <BasicTable />
  </BasicModal>
</template>
