<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { Page, useVbenDrawer, type VbenFormProps } from '@vben/common-ui';
import { CircleHelp } from '@vben/icons';
import { eachTree, getPopupContainer } from '@vben/utils';

import { Popconfirm, Space, Tooltip } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
// import { deptList, deptRemove } from '#/api/system/dept';

import mockData from './data';
import deptDrawer from './dept-drawer.vue';
import { columns, querySchema } from './schema';

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  data: mockData.data,
  rowConfig: {
    isHover: true,
    keyField: 'deptId',
  },

  treeConfig: {
    parentField: 'parentId',
    rowField: 'deptId',
    transform: true,
    expandAll: true,
  },
  id: 'system-dept-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents: {
    cellDblclick: (e: any) => {
      const { row = {} } = e;
      if (!row?.children) {
        return;
      }
      const isExpanded = row?.expand;
      tableApi.grid.setTreeExpand(row, !isExpanded);
      row.expand = !isExpanded;
    },
    // 需要监听使用箭头展开的情况 否则展开/折叠的数据不一致
    toggleTreeExpand: (e: any) => {
      const { row = {}, expanded } = e;
      row.expand = expanded;
    },
  },
});
const [DeptDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: deptDrawer,
});

function handleAdd() {
  drawerApi.setData({ update: false });
  drawerApi.open();
}

function handleSubAdd(row: Recordable<any>) {
  const { deptId } = row;
  drawerApi.setData({ id: deptId, update: false });
  drawerApi.open();
}

async function handleEdit(record: Recordable<any>) {
  drawerApi.setData({ id: record.deptId, update: true });
  drawerApi.open();
}

async function handleDelete() {
  // await deptRemove(row.deptId);
  await tableApi.query();
}

/**
 * 全部展开/折叠
 * @param expand 是否展开
 */
function setExpandOrCollapse(expand: boolean) {
  eachTree(tableApi.grid.getData(), (item) => (item.expand = expand));
  tableApi.grid?.setAllTreeExpand(expand);
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable>
      <template #toolbar-actions>
        <div class="mr-2">
          <Tooltip title="提示：双击展开/收起子菜单">
            <CircleHelp class="size-4 text-center" />
          </Tooltip>
        </div>
        <Space>
          <a-button @click="setExpandOrCollapse(false)">
            {{ $t('page.common.collapse') }}
          </a-button>
          <a-button @click="setExpandOrCollapse(true)">
            {{ $t('page.common.expand') }}
          </a-button>
          <a-button type="primary" @click="handleAdd">
            {{ $t('page.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <ghost-button @click="handleEdit(row)">
            {{ $t('page.common.edit') }}
          </ghost-button>
          <ghost-button class="btn-add" @click="handleSubAdd(row)">
            {{ $t('page.common.add') }}
          </ghost-button>
          <Popconfirm
            :get-popup-container="getPopupContainer"
            placement="left"
            title="确认删除？"
            @confirm="handleDelete"
          >
            <ghost-button danger @click.stop="">
              {{ $t('page.common.delete') }}
            </ghost-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <DeptDrawer @reload="tableApi.query()" />
  </Page>
</template>

<style lang="scss" scoped>
.btn-add {
  color: hsl(var(--success)) !important;
  border-color: hsl(var(--success)) !important;

  &:hover {
    color: hsl(var(--success) / 70%) !important;
    border-color: hsl(var(--success) / 70%) !important;
  }
}
</style>
