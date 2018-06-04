import Vue from 'vue'
import Router from 'vue-router'
import Explorer from '~/pages/Explorer'
import Starred from '~/pages/Starred'
import Settings from '~/pages/Settings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'explorer',
      component: Explorer
    },
    {
      path: '/starred',
      name: 'starred',
      component: Starred
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})
