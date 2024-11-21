<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { ref } from 'vue';

import { Page, useVbenDrawer, type VbenFormProps } from '@vben/common-ui';
import { getPopupContainer } from '@vben/utils';

import { Modal, Popconfirm, Space } from 'ant-design-vue';

import {
  tableCheckboxEvent,
  useVbenVxeGrid,
  type VxeGridProps,
} from '#/adapter/vxe-table';
import { postExport, postList, postRemove } from '#/api/system/post';
import { commonDownloadExcel } from '#/utils/file/download';
import DeptTree from '#/views/system/user/dept-tree.vue';

import postDrawer from './post-drawer.vue';
import { columns, querySchema } from './schema';

// 左边部门用
const selectDeptId = ref<string[]>([]);
const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  schema: querySchema(),
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
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
    trigger: 'cell',
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
          formValues.belongDeptId = selectDeptId.value[0];
        } else {
          Reflect.deleteProperty(formValues, 'belongDeptId');
        }

        return await postList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'postId',
  },
  id: 'system-post-index',
};

const checked = ref(false);
const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents: {
    checkboxChange: tableCheckboxEvent(checked),
    checkboxAll: tableCheckboxEvent(checked),
  },
});

const [PostDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: postDrawer,
});

function handleAdd() {
  drawerApi.setData({});
  drawerApi.open();
}

async function handleEdit(record: Recordable<any>) {
  drawerApi.setData({ id: record.postId });
  drawerApi.open();
}

async function handleDelete(row: Recordable<any>) {
  await postRemove(row.postId);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: any) => row.postId);
  Modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await postRemove(ids);
      await tableApi.query();
      checked.value = false;
    },
  });
}

function handleDownloadExcel() {
  commonDownloadExcel(
    postExport,
    '岗位信息数据',
    tableApi.formApi.form.values,
    {
      fieldMappingTime: formOptions.fieldMappingTime,
    },
  );
}
</script>

<template>
  <Page :auto-content-height="true" content-class="flex gap-[8px] w-full">
    <DeptTree
      v-model:select-dept-id="selectDeptId"
      class="w-[260px]"
      @select="() => tableApi.query()"
    />
    <BasicTable class="flex-1 overflow-hidden">
      <template #toolbar-actions>
        <Space>
          <a-button
            v-access:code="['system:post:export']"
            @click="handleDownloadExcel"
          >
            {{ $t('pages.common.export') }}
          </a-button>
          <a-button
            :disabled="!checked"
            danger
            type="primary"
            v-access:code="['system:post:delete']"
            @click="handleMultiDelete"
          >
            {{ $t('pages.common.delete') }}
          </a-button>
          <a-button
            type="primary"
            v-access:code="['system:post:add']"
            @click="handleAdd"
          >
            {{ $t('pages.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <GhostButton
            v-access:code="['system:post:edit']"
            @click="handleEdit(row)"
          >
            {{ $t('pages.common.edit') }}
          </GhostButton>
          <Popconfirm
            :get-popup-container="getPopupContainer"
            placement="left"
            title="确认删除？"
            @confirm="handleDelete(row)"
          >
            <GhostButton
              danger
              v-access:code="['system:post:delete']"
              @click.stop=""
            >
              {{ $t('pages.common.delete') }}
            </GhostButton>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <PostDrawer @reload="tableApi.query()" />
  </Page>
</template>
