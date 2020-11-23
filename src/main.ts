import { createApp } from 'vue'
import store from '@/store/store'
import router from '@/route/router'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'

createApp(App).use(router).use(store).mount('#app')
