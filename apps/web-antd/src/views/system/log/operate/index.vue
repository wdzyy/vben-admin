<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { OperationLog } from '#/api/system/operlog/model';

import { ref } from 'vue';

import { Page, useVbenDrawer, type VbenFormProps } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Modal, Space } from 'ant-design-vue';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash-es';

import {
  tableCheckboxEvent,
  useVbenVxeGrid,
  type VxeGridProps,
} from '#/adapter/vxe-table';
import {
  operLogClean,
  operLogDelete,
  operLogExport,
  operLogList,
} from '#/api/system/operlog';
import { downloadExcel } from '#/utils/file/download';
import { confirmDeleteModal } from '#/utils/modal';

import operationPreviewDrawer from './operation-preview-drawer.vue';
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

const gridOptions: VxeGridProps<OperationLog> = {
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
      query: async ({ page, sort }, formValues = {}) => {
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

        const params: any = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };

        if (!isEmpty(sort)) {
          params.orderByColumn = sort.field;
          params.isAsc = sort.order;
        }
        return await operLogList(params);
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'operId',
  },
  sortConfig: {
    remote: true,
  },
  id: 'system-operatelog-index',
};

const checked = ref(false);
const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents: {
    sortChange: () => {
      tableApi.query();
    },
    checkboxChange: tableCheckboxEvent(checked),
    checkboxAll: tableCheckboxEvent(checked),
  },
});

const [OperationPreviewDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: operationPreviewDrawer,
});

/**
 * 预览
 * @param record 操作日志记录
 */
function handlePreview(record: Recordable<any>) {
  drawerApi.setData({ record });
  drawerApi.open();
}

/**
 * 清空全部日志
 */
function handleClear() {
  confirmDeleteModal({
    onValidated: async () => {
      await operLogClean();
      await tableApi.reload();
    },
  });
}
/**
 * 删除日志
 */
async function handleDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: any) => row.operId);
  Modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条操作日志吗？`,
    onOk: async () => {
      await operLogDelete(ids);
      await tableApi.query();
      checked.value = false;
    },
  });
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable>
      <template #toolbar-actions>
        <Space>
          <a-button @click="handleClear">
            {{ $t('page.common.clear') }}
          </a-button>
          <a-button
            @click="
              downloadExcel(
                operLogExport,
                '操作日志',
                tableApi.formApi.form.values,
              )
            "
          >
            {{ $t('page.common.export') }}
          </a-button>
          <a-button
            :disabled="!checked"
            danger
            type="primary"
            @click="handleDelete"
          >
            {{ $t('page.common.delete') }}
          </a-button>
        </Space>
      </template>
      <template #action="{ row }">
        <ghost-button @click.stop="handlePreview(row)">
          {{ $t('page.common.preview') }}
        </ghost-button>
      </template>
    </BasicTable>
    <OperationPreviewDrawer />
  </Page>
</template>
