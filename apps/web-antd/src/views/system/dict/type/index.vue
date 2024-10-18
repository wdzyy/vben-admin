<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { ref } from 'vue';

import { useVbenModal, type VbenFormProps } from '@vben/common-ui';
import { getPopupContainer } from '@vben/utils';

import {
  Dropdown,
  Menu,
  MenuItem,
  type MenuProps,
  Modal,
  Popconfirm,
  Space,
} from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import {
  dictTypeExport,
  dictTypeList,
  dictTypeRemove,
  refreshDictTypeCache,
} from '#/api/system/dict/dict-type';
// import { dictSyncTenant } from '#/api/system/tenant';
import { downloadExcel } from '#/utils/file/download';

import { emitter } from '../mitt';
import dictTypeModal from './dict-type-modal.vue';
import { columns, querySchema } from './schema';

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 70,
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
        return await dictTypeList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'dictId',
  },
  id: 'system-dict-type-index',
};

const checked = ref(false);
const lastDictType = ref('');

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents: {
    cellClick: (e: any) => {
      const { row } = e;
      if (lastDictType.value === row.dictType) {
        return;
      }
      emitter.emit('rowClick', row.dictType);
      lastDictType.value = row.dictType;
    },
    checkboxChange: (e: any) => {
      checked.value = e.records.length > 0;
    },
    checkboxAll: (e: any) => {
      checked.value = e.records.length > 0;
    },
  },
});
const [DictTypeModal, modalApi] = useVbenModal({
  connectedComponent: dictTypeModal,
});

function handleAdd() {
  modalApi.setData({});
  modalApi.open();
}

async function handleEdit(record: Recordable<any>) {
  modalApi.setData({ id: record.dictId });
  modalApi.open();
}

async function handleDelete(row: Recordable<any>) {
  await dictTypeRemove(row.dictId);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: any) => row.dictId);
  Modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await dictTypeRemove(ids);
      await tableApi.query();
      checked.value = false;
    },
  });
}

const handleMenuClick: MenuProps['onClick'] = (e) => {
  switch (e.key) {
    case '1': {
      handleRefreshCache();
      break;
    }
    case '2': {
      handleSyncTenantDict();
      break;
    }
  }
};
async function handleRefreshCache() {
  await refreshDictTypeCache();
  await tableApi.query();
}

function handleSyncTenantDict() {
  Modal.confirm({
    title: '提示',
    iconType: 'warning',
    content: '确认同步租户字典？',
    onOk: async () => {
      // await dictSyncTenant();
      await tableApi.query();
    },
  });
}
</script>

<template>
  <div auto-content-height>
    <BasicTable>
      <template #toolbar-actions>
        <Space>
          <a-button type="primary" @click="handleAdd">
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
          <a-button
            @click="
              downloadExcel(
                dictTypeExport,
                '字典类型数据',
                tableApi.formApi.form.values,
              )
            "
          >
            {{ $t('page.common.export') }}
          </a-button>
          <Dropdown>
            <template #overlay>
              <Menu @click="handleMenuClick">
                <span>
                  <MenuItem key="1">刷新字典缓存</MenuItem>
                </span>
              </Menu>
            </template>
            <a-button> 更多 </a-button>
          </Dropdown>
        </Space>
      </template>
      <template #action="{ row }">
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
      </template>
    </BasicTable>
    <DictTypeModal @reload="tableApi.query()" />
  </div>
</template>
