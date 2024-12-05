import { IconPicker } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { getPopupContainer } from '@vben/utils';

import { type FormSchemaGetter, z } from '#/adapter/form';
import { type VxeGridProps } from '#/adapter/vxe-table';
import { dictDataInfo } from '#/api/system/dict/dict-data';
import { DictEnum } from '#/constants';
import { getDictOptions } from '#/utils/dict';
import { renderDict, renderIcon } from '#/utils/render';

// 菜单类型（M目录 C菜单 F按钮）
export const menuTypeOptions = [
  { label: '目录', value: 'M' },
  { label: '菜单', value: 'C' },
  { label: '按钮', value: 'F' },
];

// （M目录 C菜单 F按钮）
const menuTypes = {
  M: { value: '目录', icon: 'flat-color-icons:folder' },
  C: { value: '菜单', icon: 'material-symbols:menu' },
  F: { value: '按钮', icon: 'teenyicons:button-outline' },
};
export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'title',
    label: '菜单名称 ',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_NORMAL_DISABLE),
    },
    fieldName: 'status',
    label: '菜单状态 ',
  },
  {
    component: 'ApiSelect',
    // 对应组件的参数
    componentProps: {
      // 菜单接口转options格式
      afterFetch: (data: { dictLabel: string; dictValue: string }[]) => {
        return data.map((item: any) => ({
          label: item.dictLabel,
          value: item.dictValue,
        }));
      },
      // 菜单接口
      api: () => dictDataInfo(DictEnum.SYS_NORMAL_DISABLE),
      placeholder: '请选择',
    },
    // 字段名
    fieldName: 'api',
    // 界面显示的label
    label: 'ApiSelect',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_SHOW_HIDE),
    },
    fieldName: 'hideInMenu',
    label: '显示状态',
  },
];

export const columns: VxeGridProps['columns'] = [
  {
    title: '菜单名称',
    field: 'title',
    treeNode: true,
    minWidth: 200,
    slots: {
      // 需要i18n支持 否则返回原始值
      default: ({ row }) => $t(row.title),
    },
  },
  {
    title: '图标',
    field: 'icon',
    minWidth: 80,
    align: 'center',
    slots: {
      default: ({ row }: any) => {
        if (row?.icon === '#') {
          return '';
        }
        return (
          <span class={'flex justify-center'}>{renderIcon(row.icon)}</span>
        );
      },
    },
  },
  {
    title: '排序',
    field: 'order',
    minWidth: 120,
  },
  {
    title: '组件类型',
    field: 'menuType',
    minWidth: 150,
    slots: {
      default: ({ row }: any) => {
        const current = menuTypes[row.menuType as 'C' | 'F' | 'M'];
        if (!current) {
          return '未知';
        }
        return (
          <span class={['flex', 'items-center', 'justify-center']}>
            {renderIcon(current.icon)}
            <span style={{ marginLeft: '2px' }}>{current.value}</span>
          </span>
        );
      },
    },
  },
  {
    title: '权限标识',
    field: 'perms',
    minWidth: 150,
  },
  {
    title: '组件路径',
    field: 'component',
    minWidth: 180,
  },
  {
    title: '状态',
    field: 'status',
    minWidth: 100,
    slots: {
      default: ({ row }) => {
        return renderDict(row.status, DictEnum.SYS_NORMAL_DISABLE);
      },
    },
  },
  {
    title: '显示',
    field: 'hideInMenu',
    minWidth: 100,
    slots: {
      default: ({ row }) => {
        return renderDict(row.hideInMenu, DictEnum.SYS_SHOW_HIDE);
      },
    },
  },
  {
    title: '创建时间',
    field: 'createTime',
    minWidth: 160,
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    resizable: false,
    width: 170,
  },
];

export const drawerSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'menuId',
  },
  {
    component: 'TreeSelect',
    defaultValue: 0,
    fieldName: 'parentId',
    label: '上级菜单',
    rules: 'selectRequired',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: menuTypeOptions,
      optionType: 'button',
    },
    defaultValue: 'M',
    dependencies: {
      componentProps: (_, api) => {
        // 切换时清空校验
        // 直接抄的源码 没有清空校验的方法
        Object.keys(api.errors.value).forEach((key) => {
          api.setFieldError(key, undefined);
        });
        return {};
      },
      triggerFields: ['menuType'],
    },
    fieldName: 'menuType',
    label: '菜单类型',
  },
  {
    component: 'Input',
    dependencies: {
      // 类型不为按钮时显示
      show: (values) => values.menuType !== 'F',
      triggerFields: ['menuType'],
    },
    renderComponentContent: (model) => ({
      addonAfter: () => (
        <a href="https://icon-sets.iconify.design/" target="_blank">
          搜索图标
        </a>
      ),
      addonBefore: () => (
        <IconPicker
          modelValue={model.icon}
          onChange={(val) => {
            model.icon = val;
          }}
          v-slots={{
            trigger: () => <IconifyIcon icon={model.icon} />,
          }}
        />
      ),
    }),
    fieldName: 'icon',
    help: '点击搜索图标跳转到iconify & 粘贴',
    label: '菜单图标',
  },
  {
    component: 'Input',
    fieldName: 'title',
    label: '菜单名称',
    help: '支持i18n写法, 如: page.menu.system.title',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    fieldName: 'order',
    help: '排序, 数字越小越靠前',
    label: '显示排序',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: (model) => {
      const placeholder =
        model.isFrame === '0'
          ? '填写链接地址http(s)://  使用新页面打开'
          : '填写`路由地址`或者`链接地址`  链接默认使用内部iframe内嵌打开';
      return {
        placeholder,
      };
    },
    dependencies: {
      rules: (model) => {
        if (model.isFrame !== '0') {
          return z
            .string({ message: '请输入路由地址' })
            .refine((val) => !val.startsWith('/'), {
              message: '路由地址不需要带/',
            });
        }
        // 为链接
        return z
          .string({ message: '请输入链接地址' })
          .regex(/^https?:\/\//, { message: '请输入正确的链接地址' });
      },
      // 类型不为按钮时显示
      show: (values) => values?.menuType !== 'F',
      triggerFields: ['isFrame', 'menuType'],
    },
    fieldName: 'path',
    help: `路由地址不带/, 如: menu, user 链接为http(s)://开头 链接默认使用内部iframe打开, 可通过{是否外链}控制打开方式`,
    label: '路由地址',
  },
  {
    component: 'Input',
    componentProps: (model) => {
      return {
        // 为链接时组件disabled
        disabled: model.isFrame === '0',
      };
    },
    defaultValue: '',
    dependencies: {
      rules: (model) => {
        // 非链接时为必填项
        if (model.path && !/^https?:\/\//.test(model.path)) {
          return z
            .string()
            .min(1, { message: '非链接时必填组件路径' })
            .refine((val) => !val.startsWith('/') && !val.endsWith('/'), {
              message: '组件路径开头/末尾不需要带/',
            });
        }
        // 为链接时非必填
        return z.string().optional();
      },
      // 类型为菜单时显示
      show: (values) => values.menuType === 'C',
      triggerFields: ['menuType', 'path'],
    },
    fieldName: 'component',
    help: '填写./src/views下的组件路径, 如system/menu/index',
    label: '组件路径',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getDictOptions(DictEnum.SYS_YES_NO),
      optionType: 'button',
    },
    defaultValue: '1',
    dependencies: {
      // 类型不为按钮时显示
      show: (values) => values.menuType !== 'F',
      triggerFields: ['menuType'],
    },
    fieldName: 'isFrame',
    help: '外链为http(s)://开头 选择否时, 使用iframe从内部打开页面, 否则新窗口打开',
    label: '是否外链',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getDictOptions(DictEnum.SYS_SHOW_HIDE),
      optionType: 'button',
    },
    defaultValue: '0',
    dependencies: {
      // 类型不为按钮时显示
      show: (values) => values.menuType !== 'F',
      triggerFields: ['menuType'],
    },
    fieldName: 'hideInMenu',
    help: '隐藏后不会出现在菜单栏, 但仍然可以访问',
    label: '是否显示',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getDictOptions(DictEnum.SYS_NORMAL_DISABLE),
      optionType: 'button',
    },
    defaultValue: '0',
    dependencies: {
      // 类型不为按钮时显示
      show: (values) => values.menuType !== 'F',
      triggerFields: ['menuType'],
    },
    fieldName: 'status',
    help: '停用后不会出现在菜单栏, 也无法访问',
    label: '菜单状态',
  },
  {
    component: 'Input',
    dependencies: {
      // 类型为菜单/按钮时显示
      show: (values) => values.menuType !== 'M',
      triggerFields: ['menuType'],
    },
    fieldName: 'perms',
    help: `控制器中定义的权限字符, 如: @SaCheckPermission("system:user:import")`,
    label: '权限标识',
  },
  {
    component: 'Input',
    componentProps: (model) => ({
      // 为链接时组件disabled
      disabled: model.isFrame === '0',
      placeholder: '必须为json字符串格式',
    }),
    dependencies: {
      // 类型为菜单时显示
      show: (values) => values.menuType === 'C',
      triggerFields: ['menuType'],
    },
    fieldName: 'query',
    help: 'vue-router中的query属性, 如{"name": "xxx", "age": 16}',
    label: '路由参数',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getDictOptions(DictEnum.SYS_YES_NO),
      optionType: 'button',
    },
    defaultValue: '0',
    dependencies: {
      // 类型为菜单时显示
      show: (values) => values.menuType === 'C',
      triggerFields: ['menuType'],
    },
    fieldName: 'keepAlive',
    help: '路由的keepAlive属性',
    label: '是否缓存',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getDictOptions(DictEnum.SYS_YES_NO),
      optionType: 'button',
    },
    defaultValue: '0',
    dependencies: {
      // 类型为菜单时显示
      show: (values) => values.menuType === 'C',
      triggerFields: ['menuType'],
    },
    fieldName: 'affixTab',
    help: '是否固定标签页',
    label: '固定标签页',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getDictOptions(DictEnum.SYS_SHOW_HIDE),
      optionType: 'button',
    },
    defaultValue: '0',
    dependencies: {
      // 类型为菜单时显示
      show: (values) => values.menuType === 'C',
      triggerFields: ['menuType'],
    },
    fieldName: 'hideInTab',
    help: '当前路由在标签页是否展现',
    label: '在标签页显示',
  },
];
