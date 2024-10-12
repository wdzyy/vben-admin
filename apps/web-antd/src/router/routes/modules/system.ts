import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'eos-icons:system-group',
      keepAlive: true,
      order: 2000,
      title: $t('page.system.title'),
    },
    name: 'System',
    path: '/system',
    children: [
      {
        meta: {
          icon: 'ic:round-menu',
          title: $t('page.system.menu'),
        },
        name: 'Menus',
        path: '/system/menu',
        component: () => import('#/views/system/menu/index.vue'),
      },
    ],
  },
];

export default routes;
