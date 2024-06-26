import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import App from '@/pages/App.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: App
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
