<script setup lang="ts">
import { Avatar, Descriptions, DescriptionsItem, Tag } from 'ant-design-vue';

interface Props {
  id: string;
  endTime: string;
  startTime: string;
  title: string;
  desc: string;
  status: string;
  active: boolean;
}

const props = withDefaults(defineProps<{ info: Props }>(), {});

const emit = defineEmits<{ click: [string] }>();

function handleClick() {
  emit('click', props.info.id);
}
</script>

<template>
  <div
    :class="{
      'border-primary': info.active,
      'border-[2px]': info.active,
    }"
    class="cursor-pointer rounded-lg border-[1px] border-solid p-3 transition-shadow duration-300 ease-in-out hover:shadow-lg"
    @click.stop="handleClick"
  >
    <Descriptions :column="1" :title="info.title" size="middle">
      <template #extra>
        <Tag color="warning">审批中</Tag>
      </template>
      <DescriptionsItem label="描述">{{ info.desc }}</DescriptionsItem>
      <DescriptionsItem label="开始时间">{{ info.startTime }}</DescriptionsItem>
      <DescriptionsItem label="结束时间">{{ info.endTime }}</DescriptionsItem>
    </Descriptions>
    <div class="flex items-center justify-between text-[14px]">
      <div class="flex items-center gap-1">
        <Avatar
          size="small"
          src="https://minio.qzeyu.fun/zy-admin/logo-z.svg"
        />
        <span class="opacity-50">zyy</span>
      </div>
      <div class="opacity-50">处理时间: 2024-11-11</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-descriptions .ant-descriptions-header) {
  margin-bottom: 12px !important;
}

:deep(.ant-descriptions-item) {
  padding-bottom: 8px !important;
}
</style>
