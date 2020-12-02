import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import store from '@/store/store'
import Column from '@/views/CoulumnDetail/CoulumnDetail.vue'
import Create from '@/views/CreatePost.vue'
import Signup from '@/views/Signup.vue'

const routerHandler = createWebHistory()
const router = createRouter({
  history: routerHandler,
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadLogin: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/Column/:id',
      name: 'Column',
      component: Column
    },
    {
      path: '/Create',
      name: 'Create',
      component: Create,
      meta: { requiredLogin: true }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next({ name: 'login' })
  } else if (to.meta.redirectAlreadLogin && store.state.user.isLogin) {
    next('/')
  } else {
    next()
  }
})
export default router
