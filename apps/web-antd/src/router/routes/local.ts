import type { RouteRecordStringComponent } from '@vben/types';

import { $t } from '@vben/locales';

/**
 * 该文件放非后台返回的路由 比如个人中心 等需要跳转显示的页面
 */

/**
 * 这里放本地路由
 */
export const localMenuList: RouteRecordStringComponent[] = [
  {
    component: 'BasicLayout',
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: 'page.dashboard.title',
    },
    name: 'Dashboard',
    path: '/',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          icon: 'carbon:workspace',
          title: 'page.dashboard.workspace',
        },
      },
    ],
  },
  {
    component: 'BasicLayout',
    meta: {
      hideChildrenInMenu: true,
      icon: 'lucide:copyright',
      order: 9999,
      title: $t('demos.vben.about'),
    },
    name: 'About',
    path: '/about',
    children: [
      {
        component: '/_core/about/index',
        meta: {
          title: $t('demos.vben.about'),
        },
        name: 'VbenAbout',
        path: '/vben-admin/about',
      },
    ],
  },
];
