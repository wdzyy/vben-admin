<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import { getPopupContainer } from '@vben/utils';

import { Avatar, Modal, Popconfirm, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { userExport, userList, userRemove } from '#/api/system/user';
import { TableSwitch } from '#/components/table';
import { commonDownloadExcel } from '#/utils/file/download';

import DeptTree from './dept-tree.vue';
import { columns, querySchema } from './schema';
import userDrawer from './user-drawer.vue';
import userImportModal from './user-import-modal.vue';
import userInfoModal from './user-info-modal.vue';
import userResetPwdModal from './user-reset-pwd-modal.vue';

const moreMenuList = [
  {
    label: '用户信息',
    key: '1',
    onClick: handleUserInfo,
  },
  {
    label: '重置密码',
    key: '2',
    onClick: handleResetPwd,
  },
];

/**
 * 导入
 */
const [UserImpotModal, userImportModalApi] = useVbenModal({
  connectedComponent: userImportModal,
});

function handleImport() {
  userImportModalApi.open();
}

// 左边部门用
const selectDeptId = ref<string[]>([]);

const formOptions: VbenFormProps = {
  schema: querySchema(),
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  handleReset: async () => {
    selectDeptId.value = [];
    // eslint-disable-next-line no-use-before-define
    const { formApi, reload } = tableApi;
    await formApi.resetForm();
    const formValues = formApi.form.values;
    formApi.setLatestSubmissionValues(formValues);
    await reload(formValues);
  },
  // 日期选择格式化
  fieldMappingTime: [
    [
      'createTime',
      ['params[beginTime]', 'params[endTime]'],
      ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
    ],
  ],
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
    // 点击行选中
    trigger: 'default',
    checkMethod: ({ row }) => row?.userId !== 1,
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        // 部门树选择处理
        if (selectDeptId.value.length === 1) {
          formValues.deptId = selectDeptId.value[0];
        } else {
          Reflect.deleteProperty(formValues, 'deptId');
        }

        return await userList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  editConfig: {
    trigger: 'click',
    mode: 'row',
  },
  rowConfig: {
    isHover: true,
    keyField: 'userId',
    height: 48,
  },
  id: 'system-user-index',
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

const [UserDrawer, userDrawerApi] = useVbenDrawer({
  connectedComponent: userDrawer,
});

function handleAdd() {
  userDrawerApi.setData({});
  userDrawerApi.open();
}

function handleEdit(row: Recordable<any>) {
  userDrawerApi.setData({ id: row.userId });
  userDrawerApi.open();
}

async function handleDelete(row: Recordable<any>) {
  await userRemove(row.userId);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: any) => row.userId);
  Modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await userRemove(ids);
      await tableApi.query();
      checked.value = false;
    },
  });
}

const [UserInfoModal, userInfoModalApi] = useVbenModal({
  connectedComponent: userInfoModal,
});
function handleUserInfo(row: Recordable<any>) {
  userInfoModalApi.setData({ userId: row.userId });
  userInfoModalApi.open();
}

const [UserResetPwdModal, userResetPwdModalApi] = useVbenModal({
  connectedComponent: userResetPwdModal,
});

function handleResetPwd(record: Recordable<any>) {
  userResetPwdModalApi.setData({ record });
  userResetPwdModalApi.open();
}

function handleDownloadExcel() {
  commonDownloadExcel(userExport, '用户管理', tableApi.formApi.form.values, {
    fieldMappingTime: formOptions.fieldMappingTime,
  });
}
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full gap-[8px]">
      <DeptTree
        v-model:select-dept-id="selectDeptId"
        class="w-[260px]"
        @reload="() => tableApi.reload()"
        @select="() => tableApi.reload()"
      />
      <BasicTable class="flex-1 overflow-hidden">
        <template #toolbar-actions>
          <Space>
            <a-button @click="handleDownloadExcel">
              {{ $t('pages.common.export') }}
            </a-button>
            <a-button @click="handleImport">
              {{ $t('pages.common.import') }}
            </a-button>
            <a-button
              :disabled="!checked"
              danger
              type="primary"
              @click="handleMultiDelete"
            >
              {{ $t('pages.common.delete') }}
            </a-button>
            <a-button type="primary" @click="handleAdd">
              {{ $t('pages.common.add') }}
            </a-button>
          </Space>
        </template>
        <template #avatar="{ row }">
          <Avatar :src="row.avatar || preferences.app.defaultAvatar" />
        </template>
        <template #status="{ row }">
          <TableSwitch
            v-model="row.status"
            :api="() => (row.status === '1' ? '0' : '1')"
            :disabled="row.userId === 1"
          />
        </template>
        <template #action="{ row }">
          <template v-if="row.userId !== 1">
            <Space>
              <ghost-button @click.stop="handleEdit(row)">
                {{ $t('pages.common.edit') }}
              </ghost-button>
              <Popconfirm
                :get-popup-container="getPopupContainer"
                placement="left"
                title="确认删除？"
                @confirm="handleDelete(row)"
              >
                <ghost-button danger @click.stop="">
                  {{ $t('pages.common.delete') }}
                </ghost-button>
              </Popconfirm>
              <MoreButton :menu-items="moreMenuList" :params="row" />
            </Space>
          </template>
        </template>
      </BasicTable>
    </div>
    <UserImpotModal @reload="tableApi.query()" />
    <UserDrawer @reload="tableApi.query()" />
    <UserInfoModal />
    <UserResetPwdModal />
  </Page>
</template>
