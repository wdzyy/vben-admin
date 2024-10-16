<script setup lang="ts">
import { ref } from 'vue';
// import { useRoute } from 'vue-router';

import { type VbenFormProps } from '@vben/common-ui';
import { useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { getPopupContainer } from '@vben/utils';

import { Modal, Popconfirm, Space } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
// import { roleSelectAll, roleUnallocatedList } from '#/api/system/role';

import assignModal from './role-assign-modal.vue';
import mockData from './role-assign-table-data';
import { columns, querySchema } from './schema';

/* const route = useRoute();
const roleId = route.params.roleId as string; */

const [BasicDrawer] = useVbenDrawer();
const [AssginModal, assginModalApi] = useVbenModal({
  connectedComponent: assignModal,
});

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
    // 点击行选中
    // trigger: 'row',
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async () => {
        /* return await roleAllocatedList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          roleId,
          ...formValues,
        }); */

        return await Promise.resolve(mockData);
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'userId',
  },
  id: 'system-role-assign-index',
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

function handleAdd() {
  assginModalApi.setData({});
  assginModalApi.open();
}

/**
 * 取消授权 一条记录
 */
async function handleAuthCancel() {
  // await roleAuthCancel({ userId: record.userId, roleId });
  await tableApi.query();
}

/**
 * 批量取消授权
 */
function handleMultipleAuthCancel() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: any) => row.userId);
  Modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认取消选中的${ids.length}条授权记录吗？`,
    onOk: async () => {
      // await roleAuthCancelAll(roleId, ids);
      await tableApi.query();
      checked.value = false;
      tableApi.grid.clearCheckboxRow();
    },
  });
}
</script>

<template>
  <BasicDrawer :footer="false" class="w-[1200px]" title="选择用户">
    <BasicTable>
      <template #toolbar-actions>
        <span class="pl-[7px] text-[16px]">已分配的用户列表</span>
      </template>
      <template #toolbar-tools>
        <Space>
          <a-button
            :disabled="!checked"
            danger
            type="primary"
            @click="handleMultipleAuthCancel"
          >
            取消授权
          </a-button>
          <a-button type="primary" @click="handleAdd">
            {{ $t('page.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #action="{ row }">
        <Popconfirm
          :get-popup-container="getPopupContainer"
          :title="`是否取消授权用户[${row.userName} - ${row.nickName}]?`"
          placement="left"
          @confirm="handleAuthCancel"
        >
          <ghost-button danger @click.stop=""> 取消授权 </ghost-button>
        </Popconfirm>
      </template>
    </BasicTable>
    <AssginModal />
  </BasicDrawer>
</template>
