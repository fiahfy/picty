import Vue from 'vue';
import Router from 'vue-router';
import Main from './components/Main';
import Settings from './components/Settings';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
  ],
});
