import type { Component } from 'vue';

import { getFileNameWithoutExtension, toPascalCase } from '#/utils/common';

const componentMap = new Map<string, Component>();
// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob(['./src/**/*.vue'], { eager: true });
// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  if (!key.includes('-ignore')) {
    const mod = (modules as any)[key].default || {};
    const compName = getFileNameWithoutExtension(key);
    componentMap.set(toPascalCase(compName), mod);
  }
});

export { componentMap };
