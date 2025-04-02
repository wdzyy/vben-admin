<script setup lang="ts">
import { ref } from 'vue';

import { Modal, Switch } from 'ant-design-vue';
import { isFunction } from 'lodash-es';

type CheckedType = boolean | number | string;

interface Props {
  checkedText?: string;
  unCheckedText?: string;
  checkedValue?: CheckedType;
  unCheckedValue?: CheckedType;
  disabled?: boolean;
  /**
   * 需要自己在内部处理更新的逻辑 因为status已经双向绑定了 可以直接获取
   */
  api: () => PromiseLike<void>;
  /**
   * 更新前是否弹窗确认
   * @default false
   */
  confirm?: boolean;
  /**
   * 对应的提示内容
   * @param checked 选中的值(更新后的值)
   * @default string '确认要更新状态吗？'
   */
  confirmText?: (checked: CheckedType) => string;
}

const props = withDefaults(defineProps<Props>(), {
  checkedText: '启用',
  unCheckedText: '禁用',
  checkedValue: '0',
  unCheckedValue: '1',
  confirm: false,
  confirmText: undefined,
});

const emit = defineEmits<{ reload: [] }>();

const currentChecked = defineModel<CheckedType>('value', {
  default: false,
});

const loading = ref(false);

function confirmUpdate(checked: CheckedType, lastStatus: CheckedType) {
  const content = isFunction(props.confirmText)
    ? props.confirmText(checked)
    : `确认要更新状态吗？`;

  Modal.confirm({
    title: '提示',
    content,
    centered: true,
    onOk: async () => {
      try {
        loading.value = true;
        const { api } = props;
        isFunction(api) && (await api());
        emit('reload');
      } catch {
        currentChecked.value = lastStatus;
      } finally {
        loading.value = false;
      }
    },
    onCancel: () => {
      currentChecked.value = lastStatus;
    },
  });
}

async function handleChange(checked: CheckedType, e: Event) {
  // 阻止事件冒泡 否则会跟行选中冲突
  e.stopPropagation();
  const { checkedValue, unCheckedValue } = props;
  // 原本的状态
  const lastStatus = checked === checkedValue ? unCheckedValue : checkedValue;
  // 切换状态
  currentChecked.value = checked;
  const { api } = props;
  try {
    loading.value = true;

    if (props.confirm) {
      confirmUpdate(checked, lastStatus);
      return;
    }

    isFunction(api) && (await api());
    emit('reload');
  } catch {
    currentChecked.value = lastStatus;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Switch
    v-bind="$attrs"
    :loading="loading"
    :disabled="disabled"
    :checked="currentChecked"
    :checked-children="checkedText"
    :checked-value="checkedValue"
    :un-checked-children="unCheckedText"
    :un-checked-value="unCheckedValue"
    @change="handleChange"
  />
</template>
