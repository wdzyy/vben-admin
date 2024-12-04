declare module 'ali-oss' {
  export interface OSSOptions {
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    bucket: string;
    secure: boolean;
  }

  export interface OSSResult {
    res: {
      headers: Record<string, string>;
      status: number;
    };
    etag?: string;
    objects?: {
      name: string;
    }[];
  }

  export interface OSSError extends Error {
    code?: string;
    status?: number;
    requestId?: string;
  }

  export interface MultipartUploadResult extends OSSResult {
    uploadId: string;
  }

  export interface PartInfo {
    PartNumber: number;
    ETag: string;
    Size: number;
    LastModified: string;
  }

  export interface ListPartsResult extends OSSResult {
    uploadId: string;
    bucket: string;
    key: string;
    parts: PartInfo[];
  }

  export interface UploadInfo {
    name: string;
    uploadId: string;
    initiated: string;
  }

  export interface ListUploadsResult extends OSSResult {
    uploads: UploadInfo[];
    prefixes: string[];
    isTruncated: boolean;
    nextKeyMarker: string;
    nextUploadIdMarker: string;
  }

  export default class OSS {
    constructor(options: OSSOptions);

    abortMultipartUpload(name: string, uploadId: string): Promise<OSSResult>;

    completeMultipartUpload(
      name: string,
      uploadId: string,
      parts: Array<{ etag: string; number: number }>,
    ): Promise<OSSResult>;

    head(name: string): Promise<OSSResult>;

    initMultipartUpload(name: string): Promise<MultipartUploadResult>;

    list(options?: {
      'max-keys'?: number;
      prefix?: string;
    }): Promise<OSSResult>;

    listParts(
      name: string,
      uploadId: string,
      options?: {
        'max-parts'?: number;
        'part-number-marker'?: number;
      },
    ): Promise<ListPartsResult>;

    listUploads(options?: {
      'key-marker'?: string;
      'max-uploads'?: number;
      prefix?: string;
      'upload-id-marker'?: string;
    }): Promise<ListUploadsResult>;

    put(
      name: string,
      file: Blob,
      options?: { progress?: (p: number) => void },
    ): Promise<OSSResult>;

    uploadPart(
      name: string,
      uploadId: string,
      partNo: number,
      file: Blob,
      options?: {
        progress?: (p: number) => void;
      },
    ): Promise<OSSResult>;
  }
}
