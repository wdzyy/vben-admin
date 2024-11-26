import type {
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type RequestResponse<T = any> = AxiosResponse<T>;

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults;

interface RequestInterceptorConfig {
  fulfilled?: (
    config: InternalAxiosRequestConfig,
  ) =>
    | InternalAxiosRequestConfig<any>
    | Promise<InternalAxiosRequestConfig<any>>;
  rejected?: (error: any) => any;
}

interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (
    response: AxiosResponse<T>,
  ) => AxiosResponse | Promise<AxiosResponse>;
  rejected?: (error: any) => any;
}

type MakeErrorMessageFn = (message: string, error: any) => void;

interface HttpResponse<T = any> {
  /**
   * 0 表示成功 其他表示失败
   * 0 means success, others means fail
   */
  code: number;
  data: T;
  message: string;
  msg: string;
  success: boolean;
}

export type {
  HttpResponse,
  MakeErrorMessageFn,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestResponse,
  ResponseInterceptorConfig,
};

export type ErrorMessageMode = 'message' | 'modal' | 'none' | undefined;
export type SuccessMessageMode = ErrorMessageMode;

/**
 * 拓展axios的请求配置
 */
declare module 'axios' {
  interface AxiosRequestConfig {
    /** 是否加密请求参数  */
    encrypt?: boolean;
    /**
     * 错误弹窗类型
     */
    errorMessageMode?: ErrorMessageMode;
    /**
     * 是否返回原生axios响应
     */
    isReturnNativeResponse?: boolean;
    /**
     * 是否需要转换响应 即只获取{code, msg, data}中的data
     */
    isTransformResponse?: boolean;
    /**
     * 成功弹窗类型
     */
    successMessageMode?: SuccessMessageMode;
  }
}
