<script lang="ts" setup>
import type {
  ChunkInfo,
  OssUploadProps,
  UploadConfig,
  UploadedPart,
  UploadStatus,
} from './types/upload';

import { computed, ref, watch } from 'vue';

import OSS from 'ali-oss';
import { Button, message, Progress } from 'ant-design-vue';
import { md5 } from 'hash-wasm';

// Props 定义
const props = withDefaults(defineProps<OssUploadProps>(), {
  config: () => ({}),
  ossConfig: () => ({}),
  showFileInfo: true,
  showChunkProgress: true,
});

// Emits 定义
const emit = defineEmits<{
  statusChange: [status: UploadStatus];
  uploadError: [error: Error];
  uploadProgress: [progress: number];
  uploadSuccess: [url: string];
}>();

// 默认配置
const defaultConfig: UploadConfig = {
  chunkSize: 5 * 1024 * 1024, // 5MB
  maxFileSize: 1024 * 1024 * 1024 * 10, // 10GB
  allowedTypes: ['image/*', 'video/*', 'application/pdf', 'application/*'],
  concurrent: 3,
  retryCount: 3,
  retryDelay: 1000,
};

// 合并配置
const uploadConfig = computed(() => ({
  ...defaultConfig,
  ...props.config,
}));

// 状态管理
const uploadStatus = ref<UploadStatus>('ready'); // 上传状态
const isUploading = ref(false); // 是否正在上传
const isInitializing = ref(false); // 是否正在初始化
const uploadButtonLoading = ref(false); // 上传按钮loading状态
const totalProgress = ref(0); // 总上传进度(0-100)
const currentFile = ref<File | null>(null); // 当前选择的文件
const fileHash = ref(''); // 文件哈希值
const chunkList = ref<ChunkInfo[]>([]); // 分片列表
const uploadingChunks = ref<Set<number>>(new Set()); // 正在上传的分片索引集合
const errorMessage = ref(''); // 错误信息
const uploadId = ref(''); // OSS上传ID
const uploadedParts = ref<UploadedPart[]>([]); // 已上传的分片信息
const fileInputRef = ref<HTMLInputElement | null>(null); // 文件输入框引用
const fileInputKey = ref(0); // 文件输入框key(用于重置)

// 计算属性 - 控制按钮显示状态
// 是否可以上传
const canUpload = computed(
  () => uploadStatus.value === 'ready' || uploadStatus.value === 'error',
);
// 是否可以暂停
const canPause = computed(
  () => uploadStatus.value === 'uploading' && isUploading.value,
);
// 是否可以继续
const canResume = computed(() => uploadStatus.value === 'paused');
// 是否可以重试
const canRetry = computed(() => uploadStatus.value === 'error');
// 是否可以重置
const canReset = computed(
  () => uploadStatus.value === 'completed' || uploadStatus.value === 'error',
);

// 文件验证
const validateFile = (file: File): boolean => {
  if (file.size > uploadConfig.value.maxFileSize) {
    message.error(
      `文件大小不能超过 ${uploadConfig.value.maxFileSize / 1024 / 1024}MB`,
    );
    return false;
  }

  const isValidType = uploadConfig.value.allowedTypes.some((type) => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -2));
    }
    return file.type === type;
  });

  if (!isValidType) {
    message.error('不支持的文件类型');
    return false;
  }

  return true;
};

// 文件分片
const createFileChunks = (file: File): ChunkInfo[] => {
  const chunks: ChunkInfo[] = [];
  let cur = 0;
  let index = 0;

  while (cur < file.size) {
    chunks.push({
      chunk: file.slice(cur, cur + uploadConfig.value.chunkSize),
      index: index++,
      progress: 0,
      status: 'pending',
      hash: '',
    });
    cur += uploadConfig.value.chunkSize;
  }
  return chunks;
};

// 计算文件哈希
const calculateHash = async (file: File): Promise<string> => {
  try {
    const chunkSize = 2 * 1024 * 1024; // 2MB
    const chunks: Blob[] = [];

    // 如果文件小于等于 8MB，则直接使用整个文件
    if (file.size <= chunkSize * 4) {
      chunks.push(file.slice(0, file.size));
    } else {
      // 否则取三个点来做hash
      const positions = [
        { start: 0, end: chunkSize },
        {
          start: Math.floor(file.size / 2) - chunkSize / 2,
          end: Math.floor(file.size / 2) + chunkSize / 2,
        },
        { start: file.size - chunkSize, end: file.size },
      ];

      chunks.push(
        file.slice(positions[0]!.start, positions[0]!.end),
        file.slice(positions[1]!.start, positions[1]!.end),
        file.slice(positions[2]!.start, positions[2]!.end),
        new Blob([`${file.name}-${file.size}`]),
      );
    }

    const dataToHash = await new Blob(chunks).arrayBuffer();
    return await md5(new Uint8Array(dataToHash));
  } catch (error) {
    message.error('计算文件哈希值失败');
    throw error;
  }
};

// 创建 OSS 客户端
const createOSSClient = () => {
  return new OSS({
    region: props.ossConfig.region,
    accessKeyId: props.ossConfig.accessKeyId,
    accessKeySecret: props.ossConfig.accessKeySecret,
    bucket: props.ossConfig.bucket,
    secure: props.ossConfig.secure,
  });
};

// 更新总进度
const updateTotalProgress = () => {
  const totalChunks = chunkList.value.length;
  if (totalChunks === 0) return;

  const completedChunks = chunkList.value.filter(
    (chunk) => chunk.status === 'success',
  ).length;
  const uploadingProgress = chunkList.value.reduce((sum, chunk) => {
    return sum + (chunk.status === 'uploading' ? chunk.progress / 100 : 0);
  }, 0);

  totalProgress.value = Math.floor(
    ((completedChunks + uploadingProgress) / totalChunks) * 100,
  );
  emit('uploadProgress', totalProgress.value);
};

// 上传单个分片
const uploadChunk = async (
  chunkInfo: ChunkInfo,
): Promise<{ etag: string; number: number }> => {
  const partNumber = chunkInfo.index + 1;

  try {
    chunkInfo.status = 'uploading';
    chunkInfo.progress = 0;
    uploadingChunks.value.add(chunkInfo.index);

    const client = createOSSClient();
    const fileName = currentFile.value?.name;
    if (!fileName) throw new Error('文件名不能为空');

    const targetKey = `uploads/${fileHash.value}/${fileName}`;

    const { res, etag } = await client.uploadPart(
      targetKey,
      uploadId.value,
      partNumber,
      chunkInfo.chunk,
    );

    if (!res || !etag) {
      throw new Error(`上传分片 ${partNumber} 失败: 未获取到 ETag`);
    }

    if (res.status !== 200) {
      throw new Error(`上传分片 ${partNumber} 失败: ${res.status}`);
    }

    chunkInfo.status = 'success';
    chunkInfo.progress = 100;
    uploadingChunks.value.delete(chunkInfo.index);
    updateTotalProgress();

    return {
      number: partNumber,
      etag: etag.replaceAll('"', ''),
    };
  } catch (error) {
    chunkInfo.status = 'error';
    chunkInfo.progress = 0;
    uploadingChunks.value.delete(chunkInfo.index);
    throw error;
  }
};

// 并发上传控制
const uploadChunksWithConcurrent = async () => {
  const pendingChunks = chunkList.value.filter(
    (chunk) => chunk.status !== 'success',
  );
  const completedParts: UploadedPart[] = [];

  while (pendingChunks.length > 0 && isUploading.value) {
    const uploadTasks: Promise<UploadedPart>[] = [];
    const availableSlots =
      uploadConfig.value.concurrent - uploadingChunks.value.size;

    if (availableSlots > 0) {
      const chunksToUpload = pendingChunks.splice(0, availableSlots);

      for (const chunk of chunksToUpload) {
        if (!isUploading.value) {
          pendingChunks.unshift(
            ...chunksToUpload.filter((c) => c.status === 'pending'),
          );
          break;
        }
        uploadTasks.push(uploadChunk(chunk));
      }

      if (!isUploading.value) break;

      try {
        const results = await Promise.allSettled(uploadTasks);
        for (const result of results) {
          if (result.status === 'fulfilled') {
            completedParts.push(result.value);
          } else if (isUploading.value) {
            console.error(`分片上传失败:`, result.reason);
            throw result.reason;
          }
        }
      } catch (error) {
        if (isUploading.value) throw error;
        break;
      }
    }

    // 动态调整等待时间
    const delay = Math.min(50, Math.max(10, pendingChunks.length * 2));
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return completedParts;
};

// 检查已存在分片
const checkExistingParts = async (
  client: OSS,
  targetKey: string,
  uploadId: string,
): Promise<UploadedPart[]> => {
  try {
    const result = await client.listParts(targetKey, uploadId);
    return (result.parts || []).map((part) => ({
      number: part.PartNumber,
      etag: part.ETag.replaceAll('"', ''),
    }));
  } catch (error) {
    console.error('检查已存在分片失败:', error);
    return [];
  }
};

// 检查文件是否存在
const checkFileExists = async (
  hash: string,
  fileName: string,
): Promise<boolean> => {
  try {
    const client = createOSSClient();
    const targetKey = `uploads/${hash}/${fileName}`;

    const result = await client.list({
      prefix: targetKey,
      'max-keys': 1,
    });

    // 如果找到了匹配的文件
    return (
      result.objects?.some((obj: { name: string }) => obj.name === targetKey) ??
      false
    );
  } catch (error) {
    console.error('检查文件存在时发生错误:', error);
    return false;
  }
};

// 合并分片
const mergeChunks = async (): Promise<boolean> => {
  const client = createOSSClient();
  const fileName = currentFile.value?.name;
  if (!fileName) throw new Error('文件名不能为空');

  const targetKey = `uploads/${fileHash.value}/${fileName}`;

  try {
    isUploading.value = true;

    if (!uploadId.value) {
      const { uploadId: newUploadId } =
        await client.initMultipartUpload(targetKey);
      if (!newUploadId) throw new Error('初始化上传失败');
      uploadId.value = newUploadId;
      uploadedParts.value = [];
    }

    const existingParts = await checkExistingParts(
      client,
      targetKey,
      uploadId.value,
    );

    existingParts.forEach((part) => {
      const chunkIndex = part.number - 1;
      if (chunkList.value[chunkIndex]) {
        chunkList.value[chunkIndex].status = 'success';
        chunkList.value[chunkIndex].progress = 100;
      }
    });
    uploadedParts.value = existingParts;

    const pendingChunks = chunkList.value.filter(
      (chunk) => chunk.status !== 'success',
    );

    if (pendingChunks.length > 0) {
      const newParts = await uploadChunksWithConcurrent();
      newParts.forEach((part) => {
        const existingIndex = uploadedParts.value.findIndex(
          (p) => p.number === part.number,
        );
        if (existingIndex === -1) {
          uploadedParts.value.push(part);
        }
      });
    }

    if (!isUploading.value) return false;

    const allPartsUploaded =
      uploadedParts.value.length === chunkList.value.length;
    if (!allPartsUploaded) {
      throw new Error('部分分片未上传完成');
    }

    const sortedParts = [...uploadedParts.value].sort(
      (a, b) => a.number - b.number,
    );

    const result = await client.completeMultipartUpload(
      targetKey,
      uploadId.value,
      sortedParts,
    );

    if (!result.res || result.res.status !== 200) {
      throw new Error('合并分片失败');
    }

    uploadStatus.value = 'completed';
    totalProgress.value = 100;
    isUploading.value = false;

    emit('uploadSuccess', targetKey);
    localStorage.removeItem(`upload_${fileHash.value}`);

    return true;
  } catch (error) {
    if (isUploading.value) throw error;
    return false;
  } finally {
    if (uploadStatus.value !== 'paused') {
      uploadId.value = '';
      uploadedParts.value = [];
    }
  }
};

// 重置上传
const resetUpload = () => {
  if (fileHash.value) {
    localStorage.removeItem(`upload_${fileHash.value}`);
  }

  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
  fileInputKey.value++;

  currentFile.value = null;
  fileHash.value = '';
  chunkList.value = [];
  uploadStatus.value = 'ready';
  totalProgress.value = 0;
  errorMessage.value = '';
  uploadingChunks.value.clear();
  isUploading.value = false;
  uploadId.value = '';
  uploadedParts.value = [];

  emit('statusChange', uploadStatus.value);
};

// 文件选择处理
const handleFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (!validateFile(file)) {
    resetUpload();
    return;
  }

  try {
    currentFile.value = file;
    uploadStatus.value = 'ready';
    totalProgress.value = 0;
    errorMessage.value = '';

    message.loading({
      content: '正在计算文件哈希值...',
      key: 'hashCalc',
      duration: 2,
    });

    // eslint-disable-next-line no-console
    console.log('计算文件哈希值...', Date.now());
    fileHash.value = await calculateHash(file);
    // eslint-disable-next-line no-console
    console.log('计算文件哈希值完成...', Date.now());
    const targetKey = `uploads/${fileHash.value}/${file.name}`;

    const client = createOSSClient();
    try {
      const { uploads = [] } = await client.listUploads({
        prefix: targetKey,
        'max-uploads': 1,
      });

      if (uploads.length > 0 && uploads[0]?.uploadId) {
        uploadId.value = uploads[0].uploadId;
        const existingParts = await checkExistingParts(
          client,
          targetKey,
          uploadId.value,
        );
        uploadedParts.value = existingParts;
      } else {
        uploadId.value = '';
        uploadedParts.value = [];
      }
    } catch (error) {
      console.error('获取上传记录失败:', error);
      uploadId.value = '';
      uploadedParts.value = [];
    }

    message.success({
      content: '文件哈希值计算完成',
      key: 'hashCalc',
      duration: 2,
    });

    const chunks = createFileChunks(file);
    chunkList.value = chunks.map((chunk, index) => ({
      chunk: chunk.chunk,
      index,
      hash: `${fileHash.value}-${index}`,
      status: uploadedParts.value.some((part) => part.number === index + 1)
        ? 'success'
        : 'pending',
      progress: uploadedParts.value.some((part) => part.number === index + 1)
        ? 100
        : 0,
    }));

    updateTotalProgress();
  } catch (error) {
    const err = error as Error;
    message.error(`文件处理失败: ${err.message}`);
    uploadStatus.value = 'error';
    resetUpload();
  }
};

// 开始上传
const startUpload = async () => {
  if (!currentFile.value || chunkList.value.length === 0) {
    message.error('请先选择文件');
    return;
  }

  try {
    uploadButtonLoading.value = true;
    message.loading({
      content: '检查文件是否已存在...',
      key: 'checkFile',
      duration: 0,
    });

    const exists = await checkFileExists(
      fileHash.value,
      currentFile.value.name,
    );

    if (exists) {
      chunkList.value.forEach((chunk) => {
        chunk.status = 'success';
        chunk.progress = 100;
      });

      uploadStatus.value = 'completed';
      totalProgress.value = 100;
      isUploading.value = false;

      uploadId.value = '';
      uploadedParts.value = [];
      localStorage.removeItem(`upload_${fileHash.value}`);

      const targetKey = `uploads/${fileHash.value}/${currentFile.value.name}`;
      emit('uploadSuccess', targetKey);

      message.success({
        content: `文件已存在${targetKey}，秒传成功！`,
        key: 'checkFile',
        duration: 2,
      });
      return;
    }

    message.destroy('checkFile');
    uploadStatus.value = 'uploading';
    isUploading.value = true;
    emit('statusChange', uploadStatus.value);

    const result = await mergeChunks();

    if (result) {
      uploadStatus.value = 'completed';
      isUploading.value = false;
    } else if (!isUploading.value) {
      uploadStatus.value = 'paused';
    }
    emit('statusChange', uploadStatus.value);
  } catch (error) {
    message.destroy('checkFile');
    if (isUploading.value) {
      uploadStatus.value = 'error';
      const err = error as Error;
      emit('uploadError', err);
      message.error(`上传失败: ${err.message}`);
    }
  } finally {
    uploadButtonLoading.value = false;
  }
};

// 暂停上传
const pauseUpload = () => {
  isUploading.value = false;
  uploadStatus.value = 'paused';
  emit('statusChange', uploadStatus.value);

  const uploadInfo = {
    uploadId: uploadId.value,
    fileName: currentFile.value?.name || '',
    fileHash: fileHash.value,
    parts: uploadedParts.value,
    chunks: chunkList.value.map((chunk) => ({
      index: chunk.index,
      status: chunk.status,
      progress: chunk.progress,
    })),
  };

  localStorage.setItem(`upload_${fileHash.value}`, JSON.stringify(uploadInfo));
  message.success('上传已暂停');
};

// 继续上传
const resumeUpload = async () => {
  try {
    const savedInfoStr = localStorage.getItem(`upload_${fileHash.value}`);
    if (!savedInfoStr) {
      throw new Error('未找到上传记录');
    }

    const savedInfo = JSON.parse(savedInfoStr);
    if (!savedInfo.uploadId) {
      throw new Error('未找到上传ID');
    }

    uploadId.value = savedInfo.uploadId;
    uploadedParts.value = savedInfo.parts;

    savedInfo.chunks.forEach((savedChunk: any) => {
      const chunk = chunkList.value[savedChunk.index];
      if (chunk) {
        chunk.status = savedChunk.status;
        chunk.progress = savedChunk.progress;
      }
    });

    uploadStatus.value = 'uploading';
    isUploading.value = true;
    emit('statusChange', uploadStatus.value);

    const result = await mergeChunks();

    if (result) {
      uploadStatus.value = 'completed';
      totalProgress.value = 100;
    } else if (!isUploading.value) {
      uploadStatus.value = 'paused';
    }
    emit('statusChange', uploadStatus.value);
  } catch (error) {
    uploadStatus.value = 'error';
    const err = error as Error;
    emit('uploadError', err);
    message.error(`继续上传失败: ${err.message}`);
  }
};

// 重试上传
const retryUpload = () => {
  chunkList.value.forEach((chunk) => {
    if (chunk.status === 'error') {
      chunk.status = 'pending';
      chunk.progress = 0;
    }
  });

  errorMessage.value = '';
  uploadStatus.value = 'ready';
  emit('statusChange', uploadStatus.value);
  startUpload();
};

// 监听状态变化
watch(uploadStatus, (newStatus) => {
  emit('statusChange', newStatus);
});
</script>

<template>
  <div class="oss-upload-component">
    <div class="space-y-4">
      <div class="rounded-lg border-2 border-dashed border-gray-300 p-4">
        <input
          :key="fileInputKey"
          ref="fileInputRef"
          :disabled="isUploading"
          class="w-full"
          type="file"
          @change="handleFileChange"
        />
        <p class="mt-2 text-sm text-gray-500">
          支持的文件类型:
          {{ uploadConfig.allowedTypes.join(', ') }}，最大文件大小:
          {{ uploadConfig.maxFileSize / 1024 / 1024 }}MB
        </p>
      </div>

      <div v-if="currentFile && showFileInfo" class="space-y-2">
        <div class="rounded bg-gray-50 p-4">
          <p class="font-medium">文件信息</p>
          <p>文件名：{{ currentFile.name }}</p>
          <p>文件大小：{{ (currentFile.size / 1024 / 1024).toFixed(2) }}MB</p>
          <p>分片数量：{{ chunkList.length }}</p>
          <p>文件哈希：{{ fileHash }}</p>
        </div>
      </div>

      <!-- 进度条 -->
      <div v-if="uploadStatus !== 'ready'" class="w-full">
        <Progress
          :percent="totalProgress"
          :status="uploadStatus === 'error' ? 'exception' : undefined"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="space-x-2">
        <Button
          :disabled="!canUpload || isInitializing"
          :loading="uploadButtonLoading"
          type="primary"
          @click="startUpload"
        >
          {{ isInitializing ? '初始化中...' : '开始上传' }}
        </Button>

        <Button v-if="canPause" :disabled="isInitializing" @click="pauseUpload">
          暂停上传
        </Button>

        <Button
          v-if="canResume"
          :disabled="isInitializing"
          type="primary"
          @click="resumeUpload"
        >
          继续上传
        </Button>

        <Button
          v-if="canRetry"
          :disabled="isInitializing"
          danger
          type="primary"
          @click="retryUpload"
        >
          重试上传
        </Button>

        <Button v-if="canReset" :disabled="isInitializing" @click="resetUpload">
          重新上传
        </Button>
      </div>

      <!-- 分片上传详情 -->
      <div v-if="showChunkProgress && chunkList.length > 0" class="mt-4">
        <p class="mb-2 font-medium">分片上传进度</p>
        <div class="grid grid-cols-10 gap-2">
          <div
            v-for="chunk in chunkList"
            :key="chunk.index"
            :class="{
              'bg-blue-500': chunk.status === 'success',
              'bg-yellow-500': chunk.status === 'uploading',
              'bg-red-500': chunk.status === 'error',
              'bg-gray-200': chunk.status === 'pending',
            }"
            class="h-2 rounded"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.oss-upload-component {
  width: 100%;
}
</style>
