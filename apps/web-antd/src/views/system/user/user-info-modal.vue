<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';

import { Description, useDescription } from '#/components/description';

import { descSchema } from './info';

const [BasicModal, modalApi] = useVbenModal({
  onOpenChange: handleOpenChange,
});

const [registerDescription, { setDescProps }] = useDescription({
  column: 1,
  labelStyle: {
    minWidth: '150px',
    width: '150px',
  },
  schema: descSchema,
});

async function handleOpenChange(open: boolean) {
  if (!open) {
    return null;
  }
  modalApi.modalLoading(true);
  const user = {
    userId: 2,
    tenantId: '000000',
    deptId: 105,
    userName: 'lionli',
    nickName: '疯狂的贝er',
    userType: 'sys_user',
    email: 'crazyLionLi@qq.com',
    phonenumber: '15666666666',
    sex: '1',
    avatar:
      'https://plus.dapdap.top/minio-server/plus/2024/01/11/1adffa210eb6436c912861da47908cf4.png',
    status: '0',
    loginIp: '0:0:0:0:0:0:0:1.*.*.*',
    loginDate: '2023-11-25 16:59:46',
    remark: '测试员',
    createTime: '2023-11-25 13:06:29',
    deptName: '测试部门',
    roles: [
      {
        roleId: '2',
        roleName: '普通角色',
        roleKey: 'common',
        roleSort: 2,
        dataScope: '2',
        menuCheckStrictly: null,
        deptCheckStrictly: null,
        status: '0',
        remark: null,
        createTime: null,
        flag: false,
        superAdmin: false,
      },
    ],
    postNames: [],
    roleNames: [],
    roleIds: null,
    postIds: null,
    roleId: null,
  };

  // 赋值
  setDescProps({ data: user }, true);

  modalApi.modalLoading(false);
}
</script>

<template>
  <BasicModal :footer="false" :fullscreen-button="false" title="用户信息">
    <Description @register="registerDescription" />
  </BasicModal>
</template>
