<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { computed, ref } from 'vue';

import { useAccess } from '@vben/access';
import {
  Page,
  useVbenDrawer,
  useVbenModal,
  type VbenFormProps,
} from '@vben/common-ui';
import { getPopupContainer } from '@vben/utils';

import {
  Dropdown,
  Menu,
  MenuItem,
  message,
  Modal,
  Popconfirm,
  Space,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { roleList, roleRemove } from '#/api/system/role';
import { TableSwitch } from '#/components/table';

import roleAssignDrawer from './role-assign/role-assign-drawer.vue';
import roleAuthModal from './role-auth-modal.vue';
import roleDrawer from './role-drawer.vue';
import { columns, querySchema } from './schema';

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
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
    checkMethod: ({ row }: any) => row.roleId !== 1,
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        // 区间选择器处理
        if (formValues?.createTime) {
          formValues.params = {
            beginTime: dayjs(formValues.createTime[0]).format(
              'YYYY-MM-DD 00:00:00',
            ),
            endTime: dayjs(formValues.createTime[1]).format(
              'YYYY-MM-DD 23:59:59',
            ),
          };
          Reflect.deleteProperty(formValues, 'createTime');
        } else {
          Reflect.deleteProperty(formValues, 'params');
        }

        return await roleList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'roleId',
  },
  id: 'system-role-index',
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
const [RoleDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: roleDrawer,
});

const [RoleAssignDrawer, roleAssignDrawerApi] = useVbenDrawer({
  connectedComponent: roleAssignDrawer,
});

function handleAdd() {
  drawerApi.setData({});
  drawerApi.open();
}

async function handleEdit(record: Recordable<any>) {
  drawerApi.setData({ id: record.roleId });
  drawerApi.open();
}

function handleAssignRole(record: Recordable<any>) {
  roleAssignDrawerApi.setData({ id: record.roleId });
  roleAssignDrawerApi.open();
}

async function handleDelete(row: Recordable<any>) {
  await roleRemove(row.roleId);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row) => row.roleId);
  Modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await roleRemove(ids);
      await tableApi.query();
      checked.value = false;
    },
  });
}

const { hasAccessByRoles } = useAccess();

const isSuperAdmin = computed(() => hasAccessByRoles(['superadmin']));

const [RoleAuthModal, authModalApi] = useVbenModal({
  connectedComponent: roleAuthModal,
});

function handleAuthEdit(record: Recordable<any>) {
  authModalApi.setData({ id: record.roleId });
  authModalApi.open();
}

const exportExcel = () => {
  message.info('演示按钮，功能自行完善');
};
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable>
      <template #toolbar-actions>
        <Space>
          <a-button @click="exportExcel">
            {{ $t('page.common.export') }}
          </a-button>
          <a-button
            :disabled="!checked"
            danger
            type="primary"
            @click="handleMultiDelete"
          >
            {{ $t('page.common.delete') }}
          </a-button>
          <a-button type="primary" @click="handleAdd">
            {{ $t('page.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #status="{ row }">
        <TableSwitch
          v-model="row.status"
          :api="() => (row.status === '1' ? '0' : '1')"
        />
      </template>
      <template #action="{ row }">
        <!-- 租户管理员不可修改admin角色 防止误操作 -->
        <!-- 超级管理员可通过租户切换来操作租户管理员角色 -->
        <template
          v-if="!row.superAdmin && (row.roleKey !== 'admin' || isSuperAdmin)"
        >
          <Space>
            <ghost-button @click.stop="handleEdit(row)">
              {{ $t('page.common.edit') }}
            </ghost-button>
            <Popconfirm
              :get-popup-container="getPopupContainer"
              placement="left"
              title="确认删除？"
              @confirm="handleDelete(row)"
            >
              <ghost-button danger @click.stop="">
                {{ $t('page.common.delete') }}
              </ghost-button>
            </Popconfirm>
          </Space>
          <Dropdown
            :get-popup-container="getPopupContainer"
            placement="bottomRight"
          >
            <template #overlay>
              <Menu>
                <MenuItem key="1" @click="handleAuthEdit(row)">
                  数据权限
                </MenuItem>
                <MenuItem key="2" @click="handleAssignRole(row)">
                  分配用户
                </MenuItem>
              </Menu>
            </template>
            <a-button size="small" type="link">
              {{ $t('page.common.more') }}
            </a-button>
          </Dropdown>
        </template>
      </template>
    </BasicTable>
    <RoleDrawer @reload="tableApi.query()" />
    <RoleAuthModal @reload="tableApi.query()" />
    <RoleAssignDrawer />
  </Page>
</template>
