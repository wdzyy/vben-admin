<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { Page, useVbenDrawer, type VbenFormProps } from '@vben/common-ui';
import { eachTree, getPopupContainer } from '@vben/utils';

import { Button, Popconfirm, Space } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { menuList, menuRemove } from '#/api/system/menu';

import { columns, querySchema } from './data';
import menuDrawer from './menu-drawer.vue';

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },

  /* handleReset: () => {
    console.log('aaa');
  },
  handleSubmit: async (values) => {
    console.log('bbb', values);
  }, */
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
  proxyConfig: {
    ajax: {
      query: async (_, formValues = {}) => {
        const resp = await menuList({
          ...formValues,
        });
        return { items: resp };
      },
    },
  },
  round: true,
  rowConfig: {
    isHover: true,
    keyField: 'menuId',
  },
  showOverflow: true,
  treeConfig: {
    parentField: 'parentId',
    rowField: 'menuId',
    transform: true,
  },
  id: 'system-menu-index',
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
      const { expanded, row = {} } = e;
      row.expand = expanded;
    },
  },
});

const [MenuDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: menuDrawer,
});

function handleAdd() {
  drawerApi.setData({});
  drawerApi.open();
}

function handleSubAdd(row: Recordable<any>) {
  const { menuId } = row;
  drawerApi.setData({ id: menuId, update: false });
  drawerApi.open();
}

async function handleEdit(record: Recordable<any>) {
  drawerApi.setData({ id: record.menuId, update: true });
  drawerApi.open();
}

async function handleDelete(row: Recordable<any>) {
  await menuRemove(row.menuId);
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
  <Page auto-content-height>
    <BasicTable table-title="菜单" table-title-help="提示：双击展开/收起子菜单">
      <template #toolbar-actions>
        <Space>
          <Button @click="setExpandOrCollapse(false)">
            {{ $t('page.common.collapse') }}
          </Button>
          <Button @click="setExpandOrCollapse(true)">
            {{ $t('page.common.expand') }}
          </Button>
          <Button type="primary" @click="handleAdd">
            {{ $t('page.common.add') }}
          </Button>
        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <Button ghost size="small" type="primary" @click="handleEdit(row)">
            {{ $t('page.common.edit') }}
          </Button>
          <!-- '按钮类型'无法再添加子菜单 -->
          <Button
            v-if="row.menuType !== 'F'"
            class="btn-success"
            ghost
            size="small"
            @click="handleSubAdd(row)"
          >
            {{ $t('page.common.add') }}
          </Button>
          <Popconfirm
            :get-popup-container="getPopupContainer"
            placement="left"
            title="确认删除？"
            @confirm="handleDelete(row)"
          >
            <Button danger ghost size="small" @click.stop="">
              {{ $t('page.common.delete') }}
            </Button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <MenuDrawer @reload="tableApi.query()" />
    <!-- <Fallback v-else description="您没有菜单管理的访问权限" status="403" /> -->
  </Page>
</template>
