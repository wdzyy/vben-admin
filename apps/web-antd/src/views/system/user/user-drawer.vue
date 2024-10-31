<script setup lang="ts">
import type { Role } from '#/api/system/user/model';

import { computed, h, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { addFullName, cloneDeep, getPopupContainer } from '@vben/utils';

import { Tag } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  findUserInfo,
  getDeptTree,
  userAdd,
  userUpdate,
} from '#/api/system/user';

import { drawerSchema } from './schema';

const emit = defineEmits<{ reload: [] }>();

const roleList = ref<any[]>([
  {
    roleId: '2',
    roleName: '普通角色',
    roleKey: 'common',
    roleSort: 2,
    dataScope: '2',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    status: '0',
    remark: '普通角色',
    createTime: '2023-11-25 13:06:29',
    flag: false,
    superAdmin: false,
    color: 'success',
  },
  {
    roleId: '1754305165870075906',
    roleName: '部门负责人角色',
    roleKey: 'deptRole',
    roleSort: 3,
    dataScope: '1',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    status: '0',
    remark: '',
    createTime: '2024-02-05 08:45:20',
    flag: false,
    superAdmin: false,
  },
  {
    roleId: '1785915261624356866',
    roleName: '工作流测试角色',
    roleKey: 'workflow',
    roleSort: 4,
    dataScope: '1',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    status: '0',
    remark: '',
    createTime: '2024-05-02 14:12:34',
    flag: false,
    superAdmin: false,
  },
  {
    roleId: '1812062772839682049',
    roleName: 'AC测试',
    roleKey: 'AC',
    roleSort: 5,
    dataScope: '1',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    status: '0',
    remark: '',
    createTime: '2024-07-13 17:53:26',
    flag: false,
    superAdmin: false,
  },
]);

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('page.common.edit') : $t('page.common.add');
});

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    formItemClass: 'col-span-2',
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 80,
  },
  schema: drawerSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

/**
 * 生成角色的自定义label
 * 也可以用option插槽来做
 * renderComponentContent: () => ({
    option: ({value, label, [disabled, key, title]}) => '',
  }),
 */
function genRoleOptionlabel(role: Role) {
  const found = roleList.value.find(
    (item: any) => item.value === role.dataScope,
  );
  if (!found) {
    return role.roleName;
  }
  return h('div', { class: 'flex items-center gap-[6px]' }, [
    h('span', null, role.roleName),
    h(Tag, { color: found.color }, () => found.label),
  ]);
}

/**
 * 初始化部门选择
 */
async function setupDeptSelect() {
  // updateSchema
  const deptTree = await getDeptTree();
  // 选中后显示在输入框的值 即父节点 / 子节点
  addFullName(deptTree, 'label', ' / ');
  formApi.updateSchema([
    {
      componentProps: (formModel) => ({
        class: 'w-full',
        fieldNames: {
          key: 'id',
          value: 'id',
          children: 'children',
        },
        getPopupContainer,
        async onSelect() {
          /** 根据部门ID加载岗位 */
          // const postListResp = await postOptionSelect(deptId);
          const postListResp: any[] = [];
          const options = postListResp.map((item: any) => ({
            label: item.postName,
            value: item.postId,
          }));
          const placeholder =
            options.length > 0 ? '请选择' : '该部门下暂无岗位';
          /**
           * TODO: 可以考虑加上post编码
           */
          formApi.updateSchema([
            {
              componentProps: { options, placeholder },
              fieldName: 'postIds',
            },
          ]);
          /** 变化后需要重新选择岗位 */
          formModel.postIds = [];
        },
        placeholder: '请选择',
        showSearch: true,
        treeData: deptTree,
        treeDefaultExpandAll: true,
        treeLine: { showLeafIcon: false },
        // 筛选的字段
        treeNodeFilterProp: 'label',
        // 选中后显示在输入框的值
        treeNodeLabelProp: 'fullName',
      }),
      fieldName: 'deptId',
    },
  ]);
}

/**
 * 新增时候 从参数设置获取默认密码
 */
async function loadDefaultPassword(update: boolean) {
  if (!update) {
    formApi.setFieldValue('password', '123456');
  }
}

const [BasicDrawer, drawerApi] = useVbenDrawer({
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      // 需要重置岗位选择
      formApi.updateSchema([
        {
          componentProps: { options: [], placeholder: '请先选择部门' },
          fieldName: 'postIds',
        },
      ]);
      return null;
    }
    drawerApi.drawerLoading(true);
    const { id } = drawerApi.getData() as { id?: number | string };
    isUpdate.value = !!id;
    /** update时 禁用用户名修改 不显示密码框 */
    formApi.updateSchema([
      { componentProps: { disabled: isUpdate.value }, fieldName: 'userName' },
      {
        dependencies: { show: () => !isUpdate.value, triggerFields: ['id'] },
        fieldName: 'password',
      },
    ]);
    // 更新 && 赋值
    const { postIds, posts, roleIds, roles, user } = await findUserInfo(id);
    /* const postIds = [1, 2];
    const posts = [
      { postId: 1, postName: '岗位1' },
      { postId: 2, postName: '岗位2' },
    ];
    const roleIds = [1, 2];
    const roles = [
      { roleId: 1, roleName: '角色1', dataScope: 1 },
      { roleId: 2, roleName: '角色2', dataScope: 2 },
    ];
    const user = {
      userName: 'admin',
      nickName: 'admin',
      email: '',
    }; */
    const postOptions = (posts ?? []).map((item: any) => ({
      label: item.postName,
      value: item.postId,
    }));
    formApi.updateSchema([
      {
        componentProps: {
          // title用于选中后回填到输入框 默认为label
          optionLabelProp: 'title',
          options: roles.map((item: any) => ({
            label: genRoleOptionlabel(item),
            // title用于选中后回填到输入框 默认为label
            title: item.roleName,
            value: item.roleId,
          })),
        },
        fieldName: 'roleIds',
      },
      {
        componentProps: {
          options: postOptions,
        },
        fieldName: 'postIds',
      },
    ]);
    // 部门选择 && 初始密码
    await Promise.all([setupDeptSelect(), loadDefaultPassword(isUpdate.value)]);
    if (user) {
      await Promise.all([
        // 添加基础信息
        formApi.setValues(user),
        // 添加角色和岗位
        formApi.setFieldValue('postIds', postIds),
        formApi.setFieldValue('roleIds', roleIds),
      ]);
    }
    drawerApi.drawerLoading(false);
  },
});

async function handleConfirm() {
  try {
    drawerApi.drawerLoading(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const data = cloneDeep(await formApi.getValues());
    await (isUpdate.value ? userUpdate(data) : userAdd(data));
    emit('reload');
    await handleCancel();
  } catch (error) {
    console.error(error);
  } finally {
    drawerApi.drawerLoading(false);
  }
}

async function handleCancel() {
  drawerApi.close();
  await formApi.resetForm();
}
</script>

<template>
  <BasicDrawer :close-on-click-modal="false" :title="title" class="w-[600px]">
    <BasicForm />
  </BasicDrawer>
</template>
