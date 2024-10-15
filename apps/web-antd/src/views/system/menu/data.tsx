import { getPopupContainer } from '@vben/utils';

import { type FormSchemaGetter, z } from '#/adapter/form';
import { type VxeGridProps } from '#/adapter/vxe-table';
import { renderDictTag, renderIcon } from '#/utils/render';

// 菜单类型（M目录 C菜单 F按钮）
export const menuTypeOptions = [
  { label: '目录', value: 'M' },
  { label: '菜单', value: 'C' },
  { label: '按钮', value: 'F' },
];

export const yesNoOptions = [
  { label: '是', value: '0' },
  { label: '否', value: '1' },
];

export const sysNormalDisable = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' },
];

// （M目录 C菜单 F按钮）
const menuTypes = {
  M: { value: '目录', icon: 'fxemoji:folder' },
  C: { value: '菜单', icon: 'fluent-emoji-flat:open-book' },
  F: { value: '按钮', icon: 'fluent-emoji:ok-button' },
};

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'menuName',
    label: '菜单名称 ',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: sysNormalDisable,
    },
    fieldName: 'status',
    label: '菜单状态 ',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: yesNoOptions,
    },
    fieldName: 'visible',
    label: '显示状态',
  },
];

export const columns: VxeGridProps['columns'] = [
  {
    title: '菜单名称',
    field: 'menuName',
    treeNode: true,
    width: 200,
  },
  {
    title: '图标',
    field: 'icon',
    width: 80,
    align: 'center',
    slots: {
      default: ({ row }) => {
        if (row?.icon === '#') {
          return '';
        }
        return renderIcon(row.icon);
      },
    },
  },
  {
    title: '排序',
    field: 'orderNum',
    width: 120,
  },
  {
    title: '组件类型',
    field: 'menuType',
    width: 150,
    slots: {
      default: ({ row }) => {
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
  },
  {
    title: '组件路径',
    field: 'component',
  },
  {
    title: '状态',
    field: 'status',
    width: 100,
    slots: {
      default: ({ row }) => {
        return renderDictTag(row.status, [
          {
            dictCode: 6,
            dictSort: 1,
            dictLabel: '正常',
            dictValue: '0',
            dictType: 'sys_normal_disable',
            cssClass: 'dot-before-green',
            listClass: '',
            isDefault: 'Y',
            remark: '正常状态',
            createTime: '2023-11-25 13:06:29',
            createBy: '小明',
            default: false,
            status: '0',
          },
          {
            dictCode: 7,
            dictSort: 2,
            dictLabel: '停用',
            dictValue: '1',
            dictType: 'sys_normal_disable',
            cssClass: 'dot-before-red',
            listClass: '',
            isDefault: 'N',
            remark: '停用状态',
            createTime: '2023-11-25 13:06:29',
            createBy: '小明',
            default: false,
            status: '0',
          },
        ]);
      },
    },
  },
  {
    title: '显示',
    field: 'visible',
    width: 100,
    slots: {
      default: ({ row }) => {
        return renderDictTag(row.visible, [
          {
            dictCode: 4,
            dictSort: 1,
            dictLabel: '显示',
            dictValue: '0',
            dictType: 'sys_show_hide',
            cssClass: 'dot-before-green',
            listClass: '',
            isDefault: 'Y',
            remark: '显示菜单',
            createTime: '2023-11-25 13:06:29',
            createBy: '小明',
            default: false,
            status: '0',
          },
          {
            dictCode: 5,
            dictSort: 2,
            dictLabel: '隐藏',
            dictValue: '1',
            dictType: 'sys_show_hide',
            cssClass: 'dot-before-red',
            listClass: '',
            isDefault: 'N',
            remark: '隐藏菜单',
            createTime: '2023-11-25 13:06:29',
            createBy: '小明',
            default: false,
            status: '0',
          },
        ]);
      },
    },
  },
  {
    title: '创建时间',
    field: 'createTime',
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    width: 200,
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
    renderComponentContent: () => ({
      addonAfter: () => (
        <a href="https://icon-sets.iconify.design/" target="_blank">
          搜索图标
        </a>
      ),
    }),
    fieldName: 'icon',
    help: '点击搜索图标跳转到iconify & 粘贴',
    label: '菜单图标',
  },
  {
    component: 'Input',
    fieldName: 'menuName',
    label: '菜单名称',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    fieldName: 'orderNum',
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
      options: yesNoOptions,
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
      options: yesNoOptions,
      optionType: 'button',
    },
    defaultValue: '0',
    dependencies: {
      // 类型不为按钮时显示
      show: (values) => values.menuType !== 'F',
      triggerFields: ['menuType'],
    },
    fieldName: 'visible',
    help: '隐藏后不会出现在菜单栏, 但仍然可以访问',
    label: '是否显示',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: sysNormalDisable,
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
    fieldName: 'queryParam',
    help: 'vue-router中的query属性, 如{"name": "xxx", "age": 16}',
    label: '路由参数',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: yesNoOptions,
      optionType: 'button',
    },
    defaultValue: '0',
    dependencies: {
      // 类型为菜单时显示
      show: (values) => values.menuType === 'C',
      triggerFields: ['menuType'],
    },
    fieldName: 'isCache',
    help: '路由的keepAlive属性',
    label: '是否缓存',
  },
];
