import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    accessMode: 'frontend', // frontend\backend
    defaultAvatar: 'https://minio.qzeyu.fun/zy-admin/logo-z.svg',
    enableRefreshToken: true,
    layout: 'mixed-nav',
    loginExpiredMode: 'modal',
    name: import.meta.env.VITE_APP_TITLE,
  },
  footer: {
    enable: false,
  },
  logo: {
    source: 'https://minio.qzeyu.fun/zy-admin/logo-z.svg',
  },
  theme: {
    colorPrimary: 'hsl(214 92% 61%)',
    mode: 'light',
    semiDarkSidebar: true,
  },
});
