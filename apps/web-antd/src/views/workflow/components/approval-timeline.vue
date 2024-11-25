<script setup lang="ts">
import { Timeline, TimelineItem } from 'ant-design-vue';

/**
 * TODO: 仅为demo 后期会替换
 */
import { VbenAvatar } from '../../../../../../packages/@core/ui-kit/shadcn-ui/src/components';

interface ApprovalItem {
  id: string;
  name: string;
  status: string;
  remark?: string;
  time: string;
}

const props = defineProps<{
  list: ApprovalItem[];
}>();
</script>

<template>
  <Timeline>
    <TimelineItem v-for="item in props.list" :key="item.id">
      <template #dot>
        <div class="relative rounded-full border">
          <VbenAvatar
            class="size-[36px]"
            src="https://plus.dapdap.top/minio-server/plus/2024/11/21/925ed278e2d441beb7f695b41e13c4dd.jpg"
          />
          <div
            class="border-background absolute bottom-0 right-0 size-[16px] rounded-full border-2 bg-green-500 content-['']"
          >
            <div class="flex items-center justify-center">
              <span class="icon-[mdi--success-bold] text-white"></span>
            </div>
          </div>
        </div>
      </template>
      <div class="ml-2 flex flex-col">
        <div>发起人</div>
        <div>疯狂的牛子Li</div>
        <div>2022-01-01 12:00:00</div>
        <div class="rounded-lg border p-1">
          <span class="opacity-70">这里是备注信息</span>
        </div>
      </div>
    </TimelineItem>
  </Timeline>
</template>
