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
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: $t('demos.antd'),
        },
        name: 'AntDesignDemos',
        path: '/demos/ant-design',
        component: () => import('#/views/demos/antd/index.vue'),
      },
      {
        meta: {
          title: $t('demos.vtable.title'),
          icon: 'lucide:table',
        },
        name: 'VTable',
        path: '/v-table',
        children: [
          {
            name: 'Pivot',
            path: '/v-table/pivot',
            component: () => import('#/views/demos/v-table/index.vue'),
            meta: {
              keepAlive: true,
              title: $t('demos.vtable.pivot-table'),
            },
          },
          {
            name: 'ListTable',
            path: '/v-table/list-table',
            component: () => import('#/views/demos/v-table/list-table.vue'),
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
        component: () => import('#/views/demos/icons/index.vue'),
        meta: {
          icon: 'lucide:annoyed',
          title: $t('demos.icons.title'),
        },
      },
    ],
  },
];

export default routes;
