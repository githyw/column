<template>
  <div class="container">
    <h1 v-if="error.status">{{error.message}}</h1>
    <loader text="加载中..." v-if="isLoading"></loader>
    <global-header :user="currentUser"></global-header>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul>
          <li class="list-inline-item">₢ 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import Loader from '@/components/Loader.vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store/store'
import axios from 'axios'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  // setup里面可以传入两个参数 第一个参数为props 第二个参数为context
  setup () {
    const store = useStore<GlobalDataProps>()
    const isLoading = computed(() => store.state.Loading)
    const currentUser = computed(() => store.state.user)
    const token = computed(() => store.state.token)
    const error = computed(() => store.state.error)
    onMounted(() => {
      if (!currentUser.value.isLogin && token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
      }
    })
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style>
</style>
