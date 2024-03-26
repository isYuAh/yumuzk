import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import List from '../pages/List.vue';
import songList from '../pages/songList.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/list',
    name: 'List',
    component: List
  },
  {
    path: '/songlist',
    name: 'songlist',
    component: songList
  },
  {
    path: '/',
    redirect: '/list'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
