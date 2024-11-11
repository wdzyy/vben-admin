import type { RouteRecordStringComponent } from '@vben/types';

import { $t } from '@vben/locales';

/**
 * 该文件放非后台返回的路由 比如demo，等需要跳转显示的页面
 */

/**
 * demo
 */
const demoRoute: RouteRecordStringComponent[] = [
  {
    component: 'BasicLayout',
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: $t('demos.vtable.title'),
          icon: 'lucide:table',
        },
        name: 'VTable',
        path: '/v-table',
        component: '',
        children: [
          {
            name: 'Pivot',
            path: '/v-table/pivot',
            component: '/demos/v-table/index.vue',
            meta: {
              keepAlive: true,
              title: $t('demos.vtable.pivot-table'),
            },
          },
          {
            name: 'ListTable',
            path: '/v-table/list-table',
            component: '/demos/v-table/list-table.vue',
            meta: {
              keepAlive: true,
              title: $t('demos.vtable.list-table'),
            },
          },
        ],
      },
      {
        name: 'IconsDemo',
        path: '/demos/icons',
        component: '/demos/icons/index.vue',
        meta: {
          title: $t('demos.icons.title'),
          icon: 'lucide:annoyed',
        },
      },
    ],
  },
];

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
  ...demoRoute,
];
