<script setup lang="ts">
import { reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Avatar,
  Card,
  Divider,
  InputSearch,
  Space,
  TabPane,
  Tabs,
  Tag,
} from 'ant-design-vue';
import { debounce, uniqueId } from 'lodash-es';

import { ApprovalCard, ApprovalTimeline } from '../components';
import RejectionPng from '../components/rejection.png';

//   当容器滚动到底部时请求数据
/* const handleScroll2 = throttle((e: Event) => {
  if (!e.target) {
    return;
  }
  const buffer = 1;
  const { scrollTop, clientHeight, scrollHeight } = e.target as HTMLElement;

  if (scrollHeight - scrollTop <= clientHeight + buffer) {
    // eslint-disable-next-line no-console
    console.log('到底部了');
    // if (listData.currentPage > listData.totalPages) return;
    // listData.currentPage += 1;
    // getPageList(listData.currentPage, keyWord.value);
  }
}, 100); */
const handleScroll = debounce((e: Event) => {
  if (!e.target) {
    return;
  }
  // e.target.scrollTop 是元素顶部到当前可视区域顶部的距离，即已滚动的高度。
  // e.target.clientHeight 是元素的可视高度。
  // e.target.scrollHeight 是元素的总高度。
  const { scrollTop, clientHeight, scrollHeight } = e.target as HTMLElement;
  // 判断是否滚动到底部
  const isBottom = scrollTop + clientHeight >= scrollHeight;
  // eslint-disable-next-line no-console
  console.log(isBottom);
  // console.log(scrollTop + clientHeight);
  // console.log(scrollHeight);
}, 100);

const data = reactive(
  Array.from({ length: 10 }).map(() => ({
    id: uniqueId(),
    startTime: '2022-01-01',
    endTime: '2022-01-02',
    title: '审批任务',
    desc: '审批任务描述',
    status: '审批中',
    active: false,
  })),
);

const timeLine = Array.from({ length: 5 }).map(() => ({
  id: uniqueId(),
  name: '张三',
  status: '审批中',
  remark: '审批任务描述',
  time: '2022-01-01',
}));

const lastSelectId = ref('');
function handleCardClick(id: string) {
  // 点击的是同一个
  if (lastSelectId.value === id) {
    return;
  }
  // 反选状态 & 如果已经点击了 不变 & 保持只能有一个选中
  data.forEach((item) => {
    item.active = item.id === id;
  });
  lastSelectId.value = id;
}
</script>

<template>
  <Page :auto-content-height="true">
    <div class="flex h-full gap-2">
      <div class="bg-background flex h-full w-[320px] flex-col rounded-lg">
        <!-- 搜索条件 -->
        <div
          class="bg-background z-100 sticky left-0 top-0 w-full rounded-t-lg border-b-[1px] border-solid p-2"
        >
          <InputSearch placeholder="搜索" />
        </div>
        <div
          class="flex flex-1 flex-col gap-2 overflow-y-auto py-3"
          @scroll="handleScroll"
        >
          <ApprovalCard
            v-for="item in data"
            :key="item.id"
            :info="item"
            class="mx-2"
            @click="handleCardClick"
          />
        </div>
        <!-- total显示 -->
        <div
          class="bg-background sticky bottom-0 w-full rounded-b-lg border-t-[1px] py-2"
        >
          <div class="flex items-center justify-center">
            共 {{ data.length }} 条记录
          </div>
        </div>
      </div>
      <Card
        :body-style="{ overflowY: 'auto', height: '100%' }"
        class="flex-1 overflow-y-hidden"
        size="small"
        title="编号: 1234567890123456789012"
      >
        <div class="flex flex-col gap-5 p-4">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <div class="text-2xl font-bold">报销申请</div>
              <div>
                <Tag color="warning">申请中</Tag>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Avatar
                size="small"
                src="https://minio.qzeyu.fun/zy-admin/logo-z.svg"
              />
              <span>zyy</span>
              <div class="flex items-center opacity-50">
                <span>ZYY有限公司</span>
                <Divider type="vertical" />
                <span>提交于: 2024-11-11 11:11:11</span>
              </div>
            </div>
            <!-- 右侧图标 -->
            <div class="z-100 absolute right-3 top-3">
              <img :src="RejectionPng" class="size-[96px]" />
            </div>
          </div>
          <Tabs class="flex-1">
            <TabPane key="1" tab="审批详情">
              <div class="h-fulloverflow-y-auto">
                <Alert message="该页面仅为静态页 后期可能会用到!" type="info" />
                <Divider />
                <ApprovalTimeline :list="timeLine" />
              </div>
            </TabPane>
            <TabPane key="2" tab="审批记录">审批记录</TabPane>
            <TabPane key="3" tab="全文评论(999+)">全文评论</TabPane>
          </Tabs>
        </div>
        <!-- 固定底部 -->
        <div
          class="border-t-solid bg-background absolute bottom-0 left-0 w-full border-t-[1px] p-3"
        >
          <div class="flex justify-end">
            <Space>
              <a-button type="primary">通过</a-button>
              <a-button danger type="primary">驳回</a-button>
              <a-button>其他</a-button>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  </Page>
</template>
