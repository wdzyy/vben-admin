<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { ref } from 'vue';

import { useVbenDrawer, type VbenFormProps } from '@vben/common-ui';
import { getPopupContainer } from '@vben/utils';

import { Modal, Popconfirm, Space } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import {
  dictDataExport,
  dictDataList,
  dictDataRemove,
} from '#/api/system/dict/dict-data';
import { commonDownloadExcel } from '#/utils/file/download';

import { emitter } from '../mitt';
import dictDataDrawer from './dict-data-drawer.vue';
import { columns, querySchema } from './schema';

const dictType = ref('');

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  schema: querySchema(),
  showCollapseButton: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
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
      query: async ({ page }: any, formValues = {}) => {
        const params: any = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };
        if (dictType.value) {
          params.dictType = dictType.value;
        }

        return await dictDataList(params);
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'dictCode',
  },
  id: 'system-dict-data-index',
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

const [DictDataDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: dictDataDrawer,
});

function handleAdd() {
  drawerApi.setData({ dictType: dictType.value });
  drawerApi.open();
}

async function handleEdit(record: Recordable<any>) {
  drawerApi.setData({
    dictType: dictType.value,
    dictCode: record.dictCode,
  });
  drawerApi.open();
}

async function handleDelete(row: Recordable<any>) {
  await dictDataRemove(row.dictCode);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: any) => row.dictCode);
  Modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await dictDataRemove(ids);
      await tableApi.query();
      checked.value = false;
    },
  });
}

emitter.on('rowClick', async (value: any) => {
  dictType.value = value;
  await tableApi.query();
});

function handleDownloadExcel() {
  commonDownloadExcel(dictDataExport, '字典数据', tableApi.formApi.form.values);
}
</script>

<template>
  <div auto-content-height>
    <BasicTable>
      <template #toolbar-actions>
        <Space>
          <a-button
            :disabled="dictType === ''"
            type="primary"
            @click="handleAdd"
          >
            {{ $t('page.common.add') }}
          </a-button>
          <a-button
            :disabled="!checked"
            danger
            type="primary"
            @click="handleMultiDelete"
          >
            {{ $t('page.common.delete') }}
          </a-button>
          <a-button @click="handleDownloadExcel">
            {{ $t('page.common.export') }}
          </a-button>
        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <ghost-button @click="handleEdit(row)">
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
      </template>
    </BasicTable>
    <DictDataDrawer @reload="tableApi.query()" />
  </div>
</template>
