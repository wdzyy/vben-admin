<script lang="ts" setup>
import type { OSSOptions } from 'ali-oss';

import type { UploadConfig } from '#/components/Upload/types/upload';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Card,
  Form,
  FormItem,
  Input,
  InputNumber,
  Switch,
} from 'ant-design-vue';

import OssUpload from '#/components/Upload/OssUpload.vue';

const ossUploadRef = ref();

const ossConfig = ref<OSSOptions>({
  region: '',
  accessKeyId: '',
  accessKeySecret: '',
  bucket: '',
  secure: true,
});

const config = ref<UploadConfig>({
  minChunkSize: 10, // 10MB，小于此值时不分片
  chunkSize: 5, // 5MB 分片大小
  maxFileSize: 1024, // 1GB 最大文件大小
  allowedTypes: ['image/*', 'video/*', 'application/pdf', 'application/*'], // 允许的文件类型
  concurrent: 3, // 并发上传数
  retryCount: 3, // 重试次数
  retryDelay: 1000, // 重试延迟(ms)
});
const configs = computed(() => ({
  ...config.value,
  maxFileSize: config.value.maxFileSize * 1024 * 1024,
  minChunkSize: config.value.minChunkSize * 1024 * 1024,
  chunkSize: config.value.chunkSize * 1024 * 1024,
}));

const handleUploadSuccess = (url: string) => {
  // eslint-disable-next-line no-console
  console.log('上传成功:', url);
};

const handleUploadError = (error: Error) => {
  console.error('上传失败:', error.message);
};

const handleStatusChange = (status: string) => {
  // eslint-disable-next-line no-console
  console.log('上传状态变更:', status);
};
</script>

<template>
  <Page title="文件上传">
    <template #description>
      <div class="text-foreground/80 mt-2">
        大文件分片上传示例（支持断点续传、秒传、并发上传）, 支持阿里云 OSS
        需自行配置阿里云 OSS 相关信息
      </div>
    </template>

    <Card class="mb-5" title="分片上传">
      <Form :model="ossConfig" class="mb-4" layout="inline">
        <FormItem label="区域" name="region">
          <Input v-model:value="ossConfig.region" />
        </FormItem>
        <FormItem label="AccessKeyId" name="accessKeyId">
          <Input v-model:value="ossConfig.accessKeyId" />
        </FormItem>
        <FormItem label="AccessKeySecret" name="accessKeySecret">
          <Input v-model:value="ossConfig.accessKeySecret" />
        </FormItem>
        <FormItem label="Bucket" name="bucket">
          <Input v-model:value="ossConfig.bucket" />
        </FormItem>
        <FormItem label="Secure" name="secure">
          <Switch v-model:checked="ossConfig.secure" />
        </FormItem>
      </Form>

      <Form :model="config" class="mb-4" layout="inline">
        <FormItem label="分片大小/MB" name="chunkSize">
          <InputNumber v-model:value="config.chunkSize" class="w-full" />
        </FormItem>
        <FormItem label="最大文件大小/MB" name="maxFileSize">
          <InputNumber v-model:value="config.maxFileSize" class="w-full" />
        </FormItem>
        <FormItem label="并发上传数" name="concurrent">
          <InputNumber
            v-model:value="config.concurrent"
            class="w-full"
            placeholder="个"
          />
        </FormItem>
        <FormItem
          label="最小分片大小/MB"
          name="minChunkSize"
          tooltip="小于此值时不分片"
        >
          <InputNumber
            v-model:value="config.minChunkSize"
            class="w-full"
            placeholder="MB"
          />
        </FormItem>
      </Form>
      <OssUpload
        ref="ossUploadRef"
        :config="configs"
        :oss-config="ossConfig"
        :show-chunk-progress="true"
        :show-file-info="true"
        @status-change="handleStatusChange"
        @upload-error="handleUploadError"
        @upload-success="handleUploadSuccess"
      />
    </Card>
  </Page>
</template>
