import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      optimizeDeps: {
        include: [
          'echarts/core',
          'echarts/charts',
          'echarts/components',
          'echarts/renderers',
          'ant-design-vue/es/locale/zh_CN',
          'ant-design-vue/es/locale/en_US',
        ],
      },
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'https://apifoxmock.com/m1/5307646-4977223-default',
            ws: true,
          },
        },
        warmup: {
          clientFiles: ['./index.html', './src/{views,components}/*'],
        },
      },
    },
  };
});
