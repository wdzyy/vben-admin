import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)), // 指定组件编译入口文件
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd'],
      name: 'zy-pivot',
    },
    outDir: 'lib',
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },

  plugins: [
    vue(),
    dts({
      insertTypesEntry: true, // 插入 types 字段到 package.json
      outDir: 'lib/types', // 输出类型声明文件的目录
    }),
  ],
});
