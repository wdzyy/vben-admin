import type { ButtonType } from 'ant-design-vue/es/button/buttonTypes';

import type { PropType } from 'vue';

import { defineComponent, h } from 'vue';

import { Button } from 'ant-design-vue';
import buttonProps from 'ant-design-vue/es/button/buttonTypes';
import { omit } from 'lodash-es';

/**
 * 表格操作列按钮专用
 */
export const GhostButton = defineComponent({
  name: 'GhostButton',
  props: {
    ...omit(buttonProps(), ['type', 'size']),
    type: {
      type: String as PropType<ButtonType>,
      default: 'link',
    },
    size: {
      type: String as PropType<'large' | 'middle' | 'small'>,
      default: 'small',
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        Button,
        {
          ...props,
          ...attrs,
          type: props.type,
          size: props.size,
        },
        slots,
      );
  },
});
