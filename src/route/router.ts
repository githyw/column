import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import store from '@/store/store'
import Column from '@/views/CoulumnDetail/CoulumnDetail.vue'
import Create from '@/views/CreatePost.vue'
import Signup from '@/views/Signup.vue'
import PostDetail from '@/views/CoulumnDetail/PostDetail.vue'
import axios from 'axios'

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
      path: '/column/:id',
      name: 'column',
      component: Column
    },
    {
      path: '/posts/:id',
      name: 'posts',
      component: PostDetail,
      meta: { requiredPosts: true }
    },
    {
      path: '/create',
      name: 'create',
      component: Create,
      meta: { requiredLogin: true }
    }
  ]
})
router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { redirectAlreadLogin, requiredLogin } = to.meta
  localStorage.setItem('routerParams', JSON.stringify(to.params))
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        console.log(e)
        store.commit('logout')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadLogin) {
      next('/')
    } else {
      next()
    }
  }
})
export default router
