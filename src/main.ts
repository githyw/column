import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import 'bootstrap/dist/css/bootstrap.min.css'

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
      component: Login
    }
  ]
})
createApp(App).use(router).mount('#app')
