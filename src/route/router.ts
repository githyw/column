import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import store from '@/store/store'
const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')
const Column = () => import('@/views/CoulumnDetail/CoulumnDetail.vue')
const Create = () => import('@/views/CreatePost.vue')
const Signup = () => import('@/views/Signup.vue')
const PostDetail = () => import('@/views/CoulumnDetail/PostDetail.vue')
const EditProfile = () => import('@/views/EditProfile.vue')

const routerHandler = createWebHistory()
// const routerHandler = createWebHashHistory()
const routes = [
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
  },
  {
    path: '/edit',
    name: 'edit',
    component: EditProfile,
    meta: { requiredLogin: true }
  }
]
const router = createRouter({
  history: routerHandler,
  routes
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
