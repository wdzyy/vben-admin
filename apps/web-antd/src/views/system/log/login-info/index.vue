<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { ref } from 'vue';

import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';
import { getPopupContainer } from '@vben/utils';

import { Modal, Popconfirm, Space } from 'ant-design-vue';

import {
  useVbenVxeGrid,
  vxeCheckboxChecked,
  type VxeGridDefines,
  type VxeGridProps,
} from '#/adapter/vxe-table';
import {
  loginInfoClean,
  loginInfoExport,
  loginInfoList,
  loginInfoRemove,
  userUnlock,
} from '#/api/system/logininfo';
import { commonDownloadExcel } from '#/utils/file/download';
import { confirmDeleteModal } from '#/utils/modal';

import loginInfoModal from './login-info-modal.vue';
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
  // 日期选择格式化
  fieldMappingTime: [
    [
      'dateTime',
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
    trigger: 'row',
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        return await loginInfoList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'infoId',
  },
  id: 'system-logininfo-index',
};

const canUnlock = ref(false);
const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents: {
    checkboxChange: (e: VxeGridDefines.CheckboxChangeEventParams) => {
      const records = e.$table.getCheckboxRecords();
      canUnlock.value = records.length === 1 && records[0]?.status === '1';
    },
  },
});

const [LoginInfoModal, modalApi] = useVbenModal({
  connectedComponent: loginInfoModal,
});

function handlePreview(record: Recordable<any>) {
  modalApi.setData(record);
  modalApi.open();
}

function handleClear() {
  confirmDeleteModal({
    onValidated: async () => {
      await loginInfoClean();
      await tableApi.reload();
    },
  });
}

async function handleDelete(row: Recordable<any>) {
  await loginInfoRemove(row.infoId);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: any) => row.infoId);
  Modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await loginInfoRemove(ids);
      await tableApi.query();
    },
  });
}

async function handleUnlock() {
  const records = tableApi.grid.getCheckboxRecords();
  if (records.length !== 1) {
    return;
  }
  const { userName } = records[0];
  await userUnlock(userName);
  await tableApi.query();
  canUnlock.value = false;
  tableApi.grid.clearCheckboxRow();
}

function handleDownloadExcel() {
  commonDownloadExcel(
    loginInfoExport,
    '登录日志',
    tableApi.formApi.form.values,
    {
      fieldMappingTime: formOptions.fieldMappingTime,
    },
  );
}
</script>

<template>
  <Page auto-content-height>
    <BasicTable>
      <template #toolbar-actions>
        <Space>
          <a-button @click="handleClear">
            {{ $t('pages.common.clear') }}
          </a-button>
          <a-button @click="handleDownloadExcel">
            {{ $t('pages.common.export') }}
          </a-button>
          <a-button
            :disabled="!vxeCheckboxChecked(tableApi)"
            danger
            type="primary"
            @click="handleMultiDelete"
          >
            {{ $t('pages.common.delete') }}
          </a-button>
          <a-button :disabled="!canUnlock" type="primary" @click="handleUnlock">
            {{ $t('pages.common.unlock') }}
          </a-button>
        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <ghost-button @click.stop="handlePreview(row)">
            {{ $t('pages.common.info') }}
          </ghost-button>
          <Popconfirm
            :get-popup-container="getPopupContainer"
            placement="left"
            title="确认删除?"
            @confirm="() => handleDelete(row)"
          >
            <ghost-button danger @click.stop="">
              {{ $t('pages.common.delete') }}
            </ghost-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <LoginInfoModal />
  </Page>
</template>
