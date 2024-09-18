import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('page.demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: $t('page.demos.antd'),
        },
        name: 'AntDesignDemos',
        path: '/demos/ant-design',
        component: () => import('#/views/demos/antd/index.vue'),
      },
      {
        name: 'Pivot',
        path: '/v-table/pivot',
        component: () => import('#/views/demos/v-table/index.vue'),
        meta: {
          icon: 'lucide:copyright',
          keepAlive: true,
          title: '透视图',
        },
      },
    ],
  },
];

export default routes;
