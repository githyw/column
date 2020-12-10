import { createApp } from 'vue'
import store from '@/store/store'
import router from '@/route/router'
import axios from 'axios'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'

axios.defaults.baseURL = 'https://apis.imooc.com/api/'
// 请求拦截
axios.interceptors.request.use(config => {
  // 显示加载时旋转动画
  store.commit('setLoading', true)
  if (config.data instanceof FormData) {
    config.data.append('icode', '0BC9ABB4AD85B874')
    store.commit('setLoading', false)
  } else if (config.method === 'post' || config.method === 'patch') {
    config.data = { ...config.data, icode: '0BC9ABB4AD85B874' }
  } else {
    config.params = { ...config.params, icode: '0BC9ABB4AD85B874' }
  }
  store.commit('setError', { status: false, message: '' })
  return config
})
// 响应拦截
axios.interceptors.response.use(config => {
  // 隐藏加载时旋转动画
  store.commit('setLoading', false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})
createApp(App).use(router).use(store).mount('#app')
