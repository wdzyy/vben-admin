import type { RouteMeta as IRouteMeta } from '@vben-core/typings';

import 'vue-router';

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RouteMeta extends IRouteMeta {}
}

export interface VbenAdminProAppConfigRaw {
  VITE_GLOB_API_URL: string;
}

export interface ApplicationConfig {
  // 后端接口地址
  apiURL: string;
  // 客户端key
  clientId?: string;
  // 全局加密开关(即开启了加解密功能才会生效 不是全部接口加密 需要和后端对应)
  enableEncrypt?: boolean;
  // RSA响应解密私钥
  rsaPrivateKey?: string;
  // RSA请求加密公钥
  rsaPublicKey?: string;
  // 是否开启websocket
  websocketEnable?: boolean;
}

declare global {
  interface Window {
    _VBEN_ADMIN_PRO_APP_CONF_: VbenAdminProAppConfigRaw;
  }
}
