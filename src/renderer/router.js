import Vue from 'vue';
import Router from 'vue-router';
import MainPage from '@/renderer/pages/MainPage';
import SettingsPage from '@/renderer/pages/SettingsPage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
    },
  ],
});
