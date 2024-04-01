import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import App from '@/pages/App.vue';
import Confirm from '@/dialogPages/confirm.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: App
  },
  {
    path: '/dialog',
    children: [
      {
        name: 'dialog-confirm',
        path: 'confirm',
        component: Confirm
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
