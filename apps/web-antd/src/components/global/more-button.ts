import type { ButtonType } from 'ant-design-vue/es/button/buttonTypes';
import type { MenuItemType } from 'ant-design-vue/es/menu/src/interface';

import type { PropType } from 'vue';

import { defineComponent, h } from 'vue';

import { $t } from '@vben/locales';

import { Dropdown, Menu, MenuItem } from 'ant-design-vue';

import { GhostButton } from './button';

/**
 * 表格操作列更多按钮专用
 */
export const MoreButton = defineComponent({
  name: 'MoreButton',
  props: {
    menuItems: {
      type: Array as PropType<MenuItemType[]>,
      required: true,
    },
    type: {
      type: String as PropType<ButtonType>,
      default: 'link',
    },
    size: {
      type: String as PropType<'large' | 'middle' | 'small'>,
      default: 'small',
    },
    params: {
      type: Object as PropType<Record<string, any>>,
    },
  },
  setup(props, { attrs }) {
    return () =>
      h(
        Dropdown,
        {
          ...props,
          ...attrs,
        },
        {
          overlay: () =>
            h(
              Menu,
              {},
              {
                default: () =>
                  props.menuItems.map((item: MenuItemType) =>
                    h(
                      MenuItem,
                      {
                        key: item.key,
                        onClick: () => {
                          if (item.onClick) {
                            item.onClick(props.params as any);
                          }
                        },
                      },
                      { default: () => item.label },
                    ),
                  ),
              },
            ),
          default: () =>
            h(
              GhostButton,
              { type: props.type, size: props.size },
              { default: () => $t('pages.common.more') },
            ),
        },
      );
  },
});
