<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { roleSelectAll, roleUnallocatedList } from '#/api/system/role';

import { columns, querySchema } from './schema';

const emit = defineEmits<{ reload: [] }>();

const roleId = ref<number | string>('');
const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: (isOpen) => {
    if (!isOpen) {
      return;
    }
    const { id } = modalApi.getData() as { id: number | string };
    roleId.value = id;
  },
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
      query: async ({ page }, formValues = {}) => {
        return await roleUnallocatedList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          roleId: roleId.value,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'userId',
  },
  id: 'system-role-assign-modal',
};

const checked = ref(false);
const [BasicTable, tableApi] = useVbenVxeGrid({
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
  try {
    modalApi.modalLoading(true);
    const records = tableApi.grid.getCheckboxRecords();
    const userIds = records.map((item) => item.userId);
    if (userIds.length > 0) {
      await roleSelectAll(roleId.value, userIds);
    }
    emit('reload');
    await handleCancel();
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.modalLoading(false);
  }
}

async function handleCancel() {
  modalApi.close();
}
</script>

<template>
  <BasicModal class="h-[80%] w-[800px]" title="选择用户">
    <BasicTable />
  </BasicModal>
</template>
