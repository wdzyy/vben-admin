// 上传状态类型
export type UploadStatus =
  | 'completed'
  | 'error'
  | 'paused'
  | 'ready'
  | 'uploading';

// 分片状态类型
export type ChunkStatus = 'error' | 'pending' | 'success' | 'uploading';

// 分片信息接口
export interface ChunkInfo {
  chunk: Blob;
  index: number;
  progress: number;
  status: ChunkStatus;
  hash: string;
}

// 已上传分片信息
export interface UploadedPart {
  number: number;
  etag: string;
}

// 上传配置接口
export interface UploadConfig {
  chunkSize: number; // 分片大小
  maxFileSize: number; // 最大文件大小
  minChunkSize: number; // 小于此值时不分片
  allowedTypes: string[]; // 允许的文件类型
  concurrent: number; // 并发上传数
  retryCount: number; // 重试次数
  retryDelay: number; // 重试延迟
}

// 组件 Props 接口
export interface OssUploadProps {
  config?: Partial<UploadConfig>;
  ossConfig?: OSSConfig;
  showFileInfo?: boolean;
  showChunkProgress?: boolean;
}

// 保存的上传信息接口
export interface SavedUploadInfo {
  uploadId: string;
  fileName: string;
  fileHash: string;
  parts: UploadedPart[];
  chunks: {
    index: number;
    progress: number;
    status: ChunkStatus;
  }[];
}
