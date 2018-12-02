import Vue from 'vue'
import Router from 'vue-router'
import Explorer from '~/pages/Explorer'
import Bookmark from '~/pages/bookmark'
import Settings from '~/pages/Settings'

Vue.use(Router)

export const Name = {
  explorer: 'explorer',
  bookmark: 'bookmark',
  settings: 'settings'
}

export default new Router({
  routes: [
    {
      path: '/',
      name: Name.explorer,
      component: Explorer
    },
    {
      path: '/bookmark',
      name: Name.bookmark,
      component: Bookmark
    },
    {
      path: '/settings',
      name: Name.settings,
      component: Settings
    }
  ]
})
