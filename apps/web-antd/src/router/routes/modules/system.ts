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
      title: $t('menu.system.title'),
    },
    name: 'System',
    path: '/system',
    children: [
      {
        meta: {
          icon: 'ph:user-duotone',
          title: $t('menu.system.user'),
        },
        name: 'User',
        path: '/system/user',
        component: () => import('#/views/system/user/index.vue'),
      },
      {
        meta: {
          icon: 'eos-icons:role-binding-outlined',
          title: $t('menu.system.role'),
        },
        name: 'Role',
        path: '/system/role',
        component: () => import('#/views/system/role/index.vue'),
      },
      {
        meta: {
          icon: 'ic:round-menu',
          title: $t('menu.system.menu'),
        },
        name: 'Menus',
        path: '/system/menu',
        component: () => import('#/views/system/menu/index.vue'),
      },
      {
        meta: {
          icon: 'mingcute:department-line',
          title: $t('menu.system.department'),
        },
        name: 'Dept',
        path: '/system/dept',
        component: () => import('#/views/system/department/index.vue'),
      },

      {
        name: 'Dict',
        path: '/system/dict',
        component: () => import('#/views/system/dict/index.vue'),
        meta: {
          title: 'menu.system.dict',
          icon: 'fluent-mdl2:dictionary',
        },
      },
      {
        meta: {
          icon: 'icon-park-twotone:setting-two',
          title: $t('menu.system.config'),
        },
        name: 'ConfigItem',
        path: '/system/config-item',
        component: () => import('#/views/system/config/index.vue'),
      },
      {
        name: 'Notice',
        path: 'notice',
        component: () => import('#/views/system/notice/index.vue'),
        meta: {
          title: 'menu.system.notice',
          icon: 'fe:notice-push',
        },
      },
      {
        name: 'Log',
        path: '/log',
        meta: {
          title: 'menu.system.log.root',
          icon: 'material-symbols:logo-dev-outline',
        },
        children: [
          {
            name: 'OperateLog',
            path: '/operatelog',
            component: () => import('#/views/system/log/operate-log.vue'),
            meta: {
              title: 'menu.system.log.operation',
              icon: 'arcticons:one-hand-operation',
            },
          },
          {
            name: 'LoginLog',
            path: '/loginLog',
            component: () => import('#/views/system/log/login-log.vue'),
            meta: {
              title: 'menu.system.log.login',
              icon: 'streamline:interface-login-dial-pad-finger-password-dial-pad-dot-finger',
            },
          },
        ],
      },
    ],
  },
];

export default routes;
