import Vue from 'vue';
import Router from 'vue-router';
import MainPage from '../pages/MainPage';
import ViewerPage from '../pages/ViewerPage';
import SettingsPage from '../pages/SettingsPage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },
    {
      path: '/viewer',
      name: 'viewer',
      component: ViewerPage,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
    },
  ],
});
