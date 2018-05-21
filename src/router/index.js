import Vue from 'vue'
import Router from 'vue-router'
import Explorer from '~/pages/Explorer'
import Bookmark from '~/pages/Bookmark'
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
      path: '/bookmark',
      name: 'bookmark',
      component: Bookmark
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})
