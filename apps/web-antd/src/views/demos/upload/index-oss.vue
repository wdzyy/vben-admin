<script lang="ts" setup>
import type { OSSConfig } from '#/config/oss';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Form, FormItem, Input, Switch } from 'ant-design-vue';

import OssUpload from '#/components/Upload/OssUpload.vue';

const ossUploadRef = ref();

const ossConfig = ref<OSSConfig>({
  region: '',
  accessKeyId: '',
  accessKeySecret: '',
  bucket: '',
  secure: true,
});

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
      <OssUpload
        ref="ossUploadRef"
        :config="{
          maxFileSize: 1024 * 1024 * 1024 * 1, // 10GB
        }"
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
